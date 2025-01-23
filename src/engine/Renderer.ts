import { IInputManager, IRenderer, IWorld } from "@/interfaces/EngineInterfaces";
import { Log, setFps } from "../utils/Overlays";
import { World } from "@/classes/World";

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
    world: IWorld) {
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
      Log("KILL PROCESS", "#F00");
    }
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

    // Render loop
    this.inputManager.processInput(deltaTime); // Input processing
    this.update(); // Update
    this.draw(); // Render the scene

    requestAnimationFrame(() => this.render()); // Request the next frame
  }
}
