import {
  IInputManager,
  IRenderer,
  IWorld,
  ShadingMode,
} from "@/interfaces/EngineInterfaces";
import { Log, setFps } from "../utils/Logging";
import { Camera } from "@/engine/Camera";
import { ShaderProgram } from "./ShaderProgram";
import { vec4 } from "gl-matrix";

export class Renderer implements IRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext; // API
  inputManager: IInputManager;

  shaderProgram: ShaderProgram;
  clearColor: vec4;

  lastTime: number; // Last frame time for FPS calculation
  loadedWorld: IWorld | null; // Holds the currently loaded world

  constructor(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    shaderProgram: ShaderProgram,
    inputManager: IInputManager,
    world: IWorld,
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.inputManager = inputManager;

    this.shaderProgram = shaderProgram;
    this.clearColor = vec4.fromValues(0.15, 0.15, 0.15, 1.0);
    
    this.lastTime = 0;
    this.loadedWorld = world; // Initializes an empty world

    this.setup();

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  setup(): void {
    // Set clear color
    this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);

    // Set Face culling >>> TODO BUG HERE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // this.gl.enable(this.gl.CULL_FACE);
    // this.gl.cullFace(this.gl.FRONT_AND_BACK); // Set which faces to cull (default: back faces)
    // this.gl.frontFace(this.gl.CCW); // Counter-clockwise
    // this.gl.frontFace(this.gl.CW);  // Clockwise

    // Set depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LESS); // Use gl.LESS to allow fragments closer to the camera to overwrite farther ones
    this.gl.depthRange(0.0, 1.0); // Default: maps clip space -1 to 1 into depth buffer range 0 to 1

    // Set polygon offset avoid z-fights
    this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
    this.gl.polygonOffset(1.0, 1.0);

    // Set alpha blending for transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); // Standard alpha blending

    this.shaderProgram.use();
  }

  start(): void {
    this.lastTime = performance.now();

    this.load();
    this.render();
  }

  setShaderProgram(shader: ShaderProgram): void {
    this.shaderProgram = shader;
    shader.use();
  }
  setClearColor(color: vec4): void {
    this.clearColor = color;
    this.gl.clearColor(color[0], color[1], color[2], color[3]);
  }

  resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight
    );
    this.loadedWorld?.activeCamera?.autoAdjustAspect(this.canvas);
  }

  loadWorld(newWorld: IWorld): void {
    this.loadedWorld = newWorld;
    Log(`Switched to new world`, "#0f0");
  }

  load(): void {
    // Add loading of objects here
    Log("Loading... (TODO)", "#ff0", 5, true);
  }

  update(): void {
    // Update camera to use in the shader
    this.loadedWorld?.updateActiveCamera();

    // Camera Free Roaming
    if (this.inputManager.isMouseLockedByCanvas()) {
      const { deltaX, deltaY } = this.inputManager.getMouseDelta();
      this.loadedWorld?.activeCamera?.setYaw(this.inputManager.mouseXsensitivity * -deltaX); 
      this.loadedWorld?.activeCamera?.setPitch(this.inputManager.mouseYsensitivity * -deltaY);
    }

    // Camera translation
    if (this.inputManager.isKeyPressed("KeyW")) {
      this.loadedWorld?.activeCamera?.moveForward(0.1);
    }
    if (this.inputManager.isKeyPressed("KeyS")) {
      this.loadedWorld?.activeCamera?.moveForward(-0.1);
    }
    if (this.inputManager.isKeyPressed("KeyD")) {
      this.loadedWorld?.activeCamera?.moveRight(0.1);
    }
    if (this.inputManager.isKeyPressed("KeyA")) {
      this.loadedWorld?.activeCamera?.moveRight(-0.1);
    }

    // Object (Cube) Rotation test
    this.loadedWorld?.staticMeshes[1].rotate(0.1, [0.0, 1.0, 0.0]); // y rotation
    this.loadedWorld?.staticMeshes[1].rotate(0.1, [1.0, 0.0, 0.0]); // x rotation

    // Translation test
    // this.loadedWorld?.staticMeshes[1].translate([0.0, 0.01, 0.0]);
  }

  draw(): void {
    if (!this.loadedWorld) {
      Log("wARNING: No world loaded to render.", "#ff0");
      return;
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

    this.loadedWorld.draw();
  }

  render(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    const fps = Math.round(1 / deltaTime); // FPS calculation
    setFps(fps, deltaTime);

    this.loadedWorld?.activeCamera?.autoAdjustAspect(this.canvas);

    // Render loop
    this.inputManager.processInput(deltaTime); // Input processing
    this.update(); // Update
    this.draw(); // Render the scene

    requestAnimationFrame(() => this.render()); // Request the next frame
  }
}
