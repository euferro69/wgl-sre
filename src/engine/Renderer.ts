import { IInputManager, IRenderer } from "@/interfaces/engine_interfaces";
import { Log, setFps } from "../utils/Overlays";

export class Renderer implements IRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext; // API
  inputManager: IInputManager;
  lastTime: number; // Last frame time for FPS calculation

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, inputManager: IInputManager) {
    this.canvas = canvas;
    this.gl = gl;
    this.inputManager = inputManager;

    this.lastTime = 0;

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

  load(): void {
    // Add loading of objects here
    Log("Loading... (TODO) -> load()", "#ff0");
  }

  update(): void {
    // Add update logic if needed
    if (this.inputManager.isKeyPressed("KeyK")) {
      Log("KILL PROCESS", "#F00");
    }
  }

  draw(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // TODO draw more stuff here
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
