export interface IWebGLCanvas {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;

  // Method to initialize and setup WebGL context
  setupGL(): void;

  // Method to resize the canvas and adjust WebGL viewport
  resizeCanvas(): void;

  // Method to load shaders and objects into WebGL
  load(): void;

  // Method to update logic (could be used for animation)
  update(): void;

  // Method to render the scene
  render(): void;
}

export interface IShaderProgram {
  // Method to use the shader program in WebGL
  use(): void;

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

export interface IRenderer {
  // The WebGLCanvas object (used for rendering and updating)
  webglCanvas: IWebGLCanvas;

  // Last frame time for FPS calculation
  lastTime: number;

  // Input state tracking (keyboard and mouse)
  inputState: {
    keys: Record<string, boolean>;
    mouse: { x: number; y: number; isDown: boolean };
  };
  // Method to start the rendering loop
  start(): void;

  // Method to process user input
  processInput(deltaTime: number): void;

  // Method to bind input event listeners
  bindInputHandlers(): void;
}
