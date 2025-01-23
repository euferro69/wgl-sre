export interface IRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  inputManager: IInputManager;

  lastTime: number; // Last frame time for FPS calculation
  loadedWorld: IWorld | null; // Loaded world to draw

  start(): void; // Method to start the rendering loop
  resizeCanvas(): void; // Method to resize the canvas and adjust WebGL viewport
  loadWorld(newWorld: IWorld): void // Changes the world to render at runtime
  // Render Loop
  load(): void; // Method to load shaders and objects into WebGL
  update(): void; // Method to update logic (could be used for animation)
  draw(): void;
}

export interface IInputManager {
  canvas: HTMLCanvasElement;
  inputState: { // Input state tracking (keyboard and mouse)
    keys: Record<string, boolean>;
    mouse: { x: number; y: number; isDown: boolean };
  };

  bindInputHandlers(): void; // Method to bind input event listeners
  isKeyPressed(keyCode: string): boolean;
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

  getAttributeLocation(name: string): number;
  getUniformLocation(name: string): WebGLUniformLocation;
  setUniformMatrix4fv(name: string, value: mat4): void;
  setUniform1f(name: string, value: number): void;
  setUniform3fv(name: string, value: vec3): void;
  setUniform4fv(name: string, value: vec4): void;

  delete(): void; // Method to clean up the shader program
}

import { VertexAttributeDefinition } from "@/interfaces/GLInterfaces";

export interface IStaticMesh {
  gl: WebGLRenderingContext,
    vertices: Float32Array,
    attributes: VertexAttributeDefinition[],
    count: number,
    shaderProgram: IShaderProgram,
    mode: GLenum;

  draw(): void;
  // Update the vertex data and recreate the buffer
  updateVertices(newVertices: Float32Array): void;
  setShaderProgram(shaderProgram: IShaderProgram): void; // Set a custom shader program for this mesh
  setMode(mode: GLenum): void; // Change the rendering mode (e.g., gl.TRIANGLES, gl.LINES)

  // Clean up WebGL resources
  delete(): void;
}

import { mat4, vec3, vec4 } from "gl-matrix";

export interface ICamera {
  // Matrices
  projectionMatrix: mat4;
  viewMatrix: mat4;
  // Parameters
  position: vec3;
  target: vec3;
  up: vec3;
  fov: number; // Field of View in degrees (for perspective mode)
  aspect: number; // Aspect ratio
  near: number; // Near clipping plane
  far: number; // Far clipping plane
  mode: "perspective" | "orthographic";

  // Methods for setting camera properties
  setMode(mode: "perspective" | "orthographic"): void;
  setAspect(aspect: number): void;
  setPosition(position: vec3): void;
  setTarget(target: vec3): void;
  setFov(fov: number): void; // (for perspective mode only)

  getProjectionMatrix(): mat4;
  getViewMatrix(): mat4;
  getViewProjectionMatrix(): mat4; // Get the combined view-projection matrix

  rotate(axis: vec3, angle: number): void;
  moveForward(amount: number): void;
  moveRight(amount: number): void;
  moveUp(amount: number): void;
  roll(angle: number): void;
  lookAt(target: vec3): void;

  autoAdjustAspect(canvas: HTMLCanvasElement): void;
  logCameraState(): void;
}

export interface IWorld {
  gl: WebGLRenderingContext;
  staticMeshes: IStaticMesh[];
  cameras: ICamera[];
  activeCamera: ICamera | null;
  gridVertices: Float32Array;
  gridColors: Float32Array;

  addStaticMesh(mesh: IStaticMesh): void;
  addCamera(camera: ICamera): void;
  setActiveCamera(camera: ICamera): void;
  draw(): void;
  createGrid(): void;
  drawGrid(shaderProgram: IShaderProgram): void;
  logWorldState(): void;
}
