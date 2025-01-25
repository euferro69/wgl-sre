import {
  IInputManager,
  IRenderer,
  IWorld,
} from "@/interfaces/EngineInterfaces";
import { Log, setFps } from "../utils/Logging";
import { Camera } from "@/engine/Camera";

export class Renderer implements IRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext; // API
  inputManager: IInputManager;
  lastTime: number; // Last frame time for FPS calculation

  loadedWorld: IWorld | null; // Holds the currently loaded world

  constructor(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    inputManager: IInputManager,
    world: IWorld
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.inputManager = inputManager;

    this.lastTime = 0;

    this.loadedWorld = world; // Initializes an empty world

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  start(): void {
    this.lastTime = performance.now();

    this.load();
    this.render();
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
    // Add update logic if needed
    if (this.inputManager.isKeyPressed("KeyK")) {
      Log("Error: KILL PROCESS", "#F66");
    }

    // CAMERA MOVEMENT - TODO MOVE CAM SPEED TO SOME CONFIG OBJECT -------------------------------------------------------
    this.loadedWorld?.setActiveCamera(this.loadedWorld?.activeCamera as Camera);
    // if (this.inputManager.isMouseDown()) {
    //   const { deltaX, deltaY } = this.inputManager.getMouseDelta();

    //   // Adjust sensitivity (scaling factor) for smoother control
    //   const sensitivity = 0.5 // Lower values make movement smoother
    //   const adjustedYaw = deltaX * sensitivity;
    //   const adjustedPitch = deltaY * sensitivity;
    //   Log(`adjustedYaw = ${adjustedYaw} adjustedPitch = ${adjustedPitch}`);
    //   this.loadedWorld?.activeCamera?.setYaw(-adjustedYaw);
    //   this.loadedWorld?.activeCamera?.setPitch(-adjustedPitch);
    //   // this.loadedWorld?.activeCamera?.roll(1.0);

    //   // Update the last mouse position after using the delta
    //   this.inputManager.setMouseLastXY(this.inputManager.getMouseX(), this.inputManager.getMouseY());
    // }
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
    // END TEST ---------------------------------------------------
  }

  draw(): void {
    if (!this.loadedWorld) {
      Log("wARNING: No world loaded to render.", "#ff0");
      return;
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // TODO draw more stuff here
    this.loadedWorld?.draw();
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
