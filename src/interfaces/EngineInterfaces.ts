import { mat4, vec3, vec4 } from "gl-matrix";
import { VertexAttributeDefinition } from "@/interfaces/GLInterfaces";
import { ShaderProgram } from "@/engine/ShaderProgram";

export enum ShadingMode {
  Unlit = 0,              // Unlit shading: no lighting calculations, uses texture or base color only.
  Wireframe = 1,          // Wireframe rendering: edges of the geometry only.
  Flat = 2,               // Flat shading: one normal per face, gives a faceted look.
  BlinnPhong = 3,         // Blinn-Phong shading: similar to Phong but optimized for specular highlights.
  PBR = 4,                // Physically-Based Rendering (PBR): realistic shading using physical material properties.
  Raytracing = 5,         // Raytracing: soots rays around to simulate light interactions with surfaces for realistic reflections, refractions, and shadows.
  Raymarching = 6,        // Raymarching: renders implicit surfaces or volumetric effects by iteratively stepping through a scene using signed distance fields (SDF).
  Pathtracing = 7,        // Pathtracing: a more advanced form of raytracing wit random rays that simulates global illumination by tracing many light paths for accurate indirect lighting.
  Toon = 8,               // Toon shading (Cel shading): cartoon-like rendering with discrete lighting levels.
}
export interface IRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  inputManager: IInputManager;

  shaderProgram: ShaderProgram;
  clearColor: vec4;

  lastTime: number; // Last frame time for FPS calculation
  loadedWorld: IWorld | null; // Loaded world to draw

  setup(): void; // Method to setup gl configurations
  start(): void; // Method to start the rendering loop

  setShaderProgram(shader: ShaderProgram): void;
  setClearColor(color: vec4): void;

  resizeCanvas(): void; // Method to resize the canvas and adjust WebGL viewport
  loadWorld(newWorld: IWorld): void; // Changes the world to render at runtime

  // Render Loop
  load(): void; // Method to load shaders and objects
  update(): void; // Method to update logic (could be used for animation)
  draw(): void;
}

export interface IInputManager {
  canvas: HTMLCanvasElement;
  inputState: {
    keys: Record<string, boolean>;
    mouse: {
      x: number; y: number;
      lastX: number; lastY: number;
      isDown: boolean
    };
  };
  mouseXsensitivity: number;
  mouseYsensitivity: number;

  bindInputHandlers(): void; // Method to bind input event listeners
  isKeyPressed(keyCode: string): boolean;
  isMouseDown(): boolean;

  getMouseX(): number;
  getMouseY(): number;
  getMouseDelta(): { deltaX: number, deltaY: number };
  setMouseLastXY(lastX: number, lastY: number): void;

  processInput(deltaTime: number): void;
}

export interface IFileManager {
  readTXT(path: string): Promise<string>;
  readGLSL(path: string): Promise<string>;
  readFBX(path: string): Promise<string>;
  readOBJ(path: string): Promise<string>;

  writeFile(path: string, str: string): Promise<void>;
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
  setUniform1i(name: string, value: number): void;
  setUniform1f(name: string, value: number): void;
  setUniform3fv(name: string, value: vec3): void;
  setUniform4fv(name: string, value: vec4): void;

  delete(): void; // Method to clean up the shader program
}

export interface IStaticMesh {
  gl: WebGLRenderingContext;
  shaderProgram: IShaderProgram;

  vertices: Float32Array;
  indices: Uint16Array | null;
  vertexBuffer: WebGLBuffer | null;
  indexBuffer: WebGLBuffer | null;
  attributes: VertexAttributeDefinition[];
  vertexCount: number;

  drawingMode: GLenum;
  modelMatrix: mat4;

  b_showWireframe: boolean;
  b_showPoints: boolean;
  wireframeColor: vec4;
  pointColor: vec4;
  pointSize: number;

  setShaderProgram(shaderProgram: IShaderProgram): void; // Set a custom shader program for this mesh

  setVertices(newVertices: Float32Array): void;
  setIndices(newIndices: Uint16Array): void;
  createVertexBuffer(): void;
  createIndexBuffer(): void;

  setShowWireframe(newValue: boolean): void;
  setShowPonits(newValue: boolean): void;
  setWireframeColor(newColor: vec4): void;
  setPointColor(newColor: vec4): void;
  
  setDrawingMode(mode: GLenum): void; // Change the rendering mode (e.g., gl.TRIANGLES, gl.LINES)
  draw(): void;

  translate(vector: vec3): void; // [x,y,z]
  rotate(angle: number, axis: vec3): void; // [x,y,z] // radians = degrees * (Math.PI / 180)
  scale(scale: vec3): void; // [x,y,z]

  // Clean up WebGL resources
  delete(): void;
}

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
  pitch: number;
  yaw: number;
  roll: number;

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
  setPitch(angle: number): void;
  setYaw(angle: number): void;
  setRoll(angle: number): void;

  moveForward(amount: number): void;
  moveRight(amount: number): void;
  moveUp(amount: number): void;
  lookAt(target: vec3): void;

  autoAdjustAspect(canvas: HTMLCanvasElement): void;
  logCameraState(): void;
}

export interface ILight {
  // Common properties for all lights
  color: vec3; // RGB color (values between 0 and 1)
  intensity: number; // Intensity of the light (typically 0 to 1)

  // Additional parameters (optional)
  castShadows?: boolean; // Whether this light casts shadows or not (default = true)
}
export interface IDirectionalLight extends ILight {
  direction?: vec3; // Direction vector (normalized)
}
export interface IPointLight extends ILight {
  position?: vec3; // Position of the light in world space
  // Attenuation properties
  attenuationFactor?: number; // Quadratic attenuation factor (default = 1.0)
}
export interface ISpotLight extends ILight {
  position?: vec3; // Position of the light in world space
  direction?: vec3; // Direction vector (normalized)
  // Spotlight-specific properties
  cutoffAngle?: number; // The angle of the spotlight's cone (in degrees)
  outerCutoffAngle?: number; // The outer angle for the falloff (only for spotlights)
}

export interface IWorld {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;

  // Objects in the world
  staticMeshes: IStaticMesh[];
  cameras: ICamera[];
  activeCamera: ICamera | null;
  directionalLight: IDirectionalLight | null;
  ambientlight: ILight | null;
  pointLights: IPointLight[];
  spotLights: ISpotLight[];

  shaderProgram: IShaderProgram;

  // Grid data
  gridVertices: Float32Array;
  gridColors: Float32Array;
  gridModelMatrix: mat4;
  gridSize: number;
  gridColor: vec4;
  gridXColor: vec4;
  gridYColor: vec4;
  gridZColor: vec4;
  vertexBuffer: WebGLBuffer | null;
  colorBuffer: WebGLBuffer | null;
  b_showGrid: boolean;

  setGridSize(newSize: number): void;
  setGridColor(newColor: vec4): void;
  setGridXColor(newColor: vec4): void;
  setGridYColor(newColor: vec4): void;
  setGridZColor(newColor: vec4): void;
  setShowGrid(newValue: boolean): void;

  addStaticMesh(mesh: IStaticMesh): void;
  addCamera(camera: ICamera): void;
  setActiveCamera(camera: ICamera): void;
  setDirectionalLight(newDirectionalLight: IDirectionalLight): void;
  setAmbientLight(ambientLight: ILight): void;
  addPointLight(light: IPointLight): void;
  addSpotLight(light: ISpotLight): void;

  load(): void;
  draw(): void;
  createGrid(): void;
  drawGrid(): void;
  logWorldState(): void;

  destroy(): void;
}

export const COORD_SYS_UP: vec3 = vec3.fromValues(0, 1, 0);