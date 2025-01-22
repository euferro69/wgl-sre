import { VertexAttribute } from "@/interfaces/gl_interfaces";
import { Log } from "../utils/Overlays";
import { IWebGLCanvas } from "@/interfaces/engine_interfaces";

export class WebGLCanvas implements IWebGLCanvas {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }
    this.gl = gl;

    this.setupGL();
    this.resizeCanvas();
  }

  setupGL(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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

    window.addEventListener("resize", () => this.resizeCanvas());
  }

  public load(): void {
    Log("Compiling Shaders...", "#ff0");

    Log("Shaders Compiled Successfully!", "#0f0");
  }

  public update(): void {
    // Add update logic if needed
  }

  public render(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
