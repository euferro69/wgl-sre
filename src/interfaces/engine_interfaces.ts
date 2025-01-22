export interface IRenderer {
  // WebGL API requirements
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  inputManager: IInputManager;
  // Last frame time for FPS calculation
  lastTime: number;

  // Method to start the rendering loop
  start(): void;

  // Method to resize the canvas and adjust WebGL viewport
  resizeCanvas(): void;

  // Method to load shaders and objects into WebGL
  load(): void;

  // Method to update logic (could be used for animation)
  update(): void;

  // Method to render (draw) the scene
  draw(): void;
}

export interface IInputManager {
  canvas: HTMLCanvasElement;
  // Input state tracking (keyboard and mouse)
  inputState: {
    keys: Record<string, boolean>;
    mouse: { x: number; y: number; isDown: boolean };
  };

  // Method to bind input event listeners
  bindInputHandlers(): void;

  isKeyPressed(keyCode: string): boolean;

  // Method to process user input
  processInput(deltaTime: number): void;
}

export interface IShaderProgram {
  // Method to use the shader program in WebGL
  use(): void;

  // Methods used for shader compilation process
  createShader(type: GLenum, source: string): WebGLShader;
  createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram;

  // Method to get the attribute location from the shader program
  getAttributeLocation(name: string): number;

  // Method to get the uniform location from the shader program
  getUniformLocation(name: string): WebGLUniformLocation;

  // Method to set a uniform matrix4 value
  setUniformMatrix4fv(name: string, value: Float32Array): void;

  // Method to set a uniform 1f value
  setUniform1f(name: string, value: number): void;

  // Method to set a uniform 3fv value
  setUniform3fv(name: string, value: Float32Array): void;

  // Method to set a uniform 4fv value
  setUniform4fv(name: string, value: Float32Array): void;

  // Method to clean up the shader program
  delete(): void;
}

import { VertexAttribute } from "@/interfaces/gl_interfaces"; // Assuming a VertexAttribute interface exists

export interface IStaticMesh {
  // Attributes describing the vertex data structure
  attributes: VertexAttribute[];

  // Draw the mesh
  draw(): void;

  // Update the vertex data and recreate the buffer
  updateVertices(newVertices: Float32Array): void;

  // Set a custom shader program for this mesh
  setShaderProgram(shaderProgram: IShaderProgram): void;

  // Change the rendering mode (e.g., gl.TRIANGLES, gl.LINES)
  setMode(mode: GLenum): void;

  // Clean up WebGL resources
  delete(): void;
}
