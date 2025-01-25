import { mat4, vec3, vec4 } from "gl-matrix";
import { IDirectionalLight, ILight, IPointLight, ISpotLight, IStaticMesh, IWorld } from "@/interfaces/EngineInterfaces";
import { ICamera } from "@/interfaces/EngineInterfaces";
import { IShaderProgram } from "@/interfaces/EngineInterfaces";
import { Log } from "@/utils/Logging";
import { ShaderProgram } from "@/engine/ShaderProgram";

export class World implements IWorld {
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
  // Default Shader
  shaderProgram: ShaderProgram;
  // Grid
  gridVertices: Float32Array;
  gridColors: Float32Array;
  gridSize: number = 10; // Size of the grid (10x10 squares)
  gridColor: number[] = [0.5, 0.5, 0.5, 1.0]; // Default grid line color
  vertexBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, canvas: HTMLCanvasElement) {
    this.gl = gl;
    this.canvas = canvas;
    // World Objects
    this.staticMeshes = [];
    this.cameras = [];
    this.activeCamera = null;
    this.directionalLight = null;
    this.ambientlight = null;
    this.pointLights = [];
    this.spotLights = [];
    // Shader
    this.shaderProgram = shaderProgram;
    // Grid
    this.gridVertices = new Float32Array();
    this.gridColors = new Float32Array();
    this.vertexBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();

    this.createGrid();
  }

  setDirectionalLight(newDirectionalLight: IDirectionalLight): void {
    this.directionalLight = newDirectionalLight;
    this.shaderProgram.setUniform3fv("u_directionalLight", newDirectionalLight.direction as vec3);
  }

  setAmbientLight(ambientLight: ILight): void {
    this.ambientlight = ambientLight;
  }

  addPointLight(light: IPointLight): void {
    this.pointLights.push(light);
  }

  addSpotLight(light: ISpotLight): void {
    this.spotLights.push(light);
  }

  setGridSize(newSize: number) {
    this.gridSize = newSize;
  }

  setGridDefaultColor(newColor: vec4) {
    this.gridColor = [...newColor];
  }

  // Add a static mesh to the world
  addStaticMesh(mesh: IStaticMesh): void {
    this.staticMeshes.push(mesh);
  }

  // Set the active camera
  setActiveCamera(camera: ICamera): void {
    if (this.cameras.includes(camera)) {
      this.activeCamera = camera;
      camera.autoAdjustAspect(this.canvas);

    // Set camera matrices in the shader
    this.shaderProgram.setUniformMatrix4fv(
      "u_viewMatrix",
      camera.getViewMatrix() as Float32Array
    )
    this.shaderProgram.setUniformMatrix4fv(
      "u_projectionMatrix",
      camera.getProjectionMatrix() as Float32Array
    );
    } else {
      Log("Error: Camera not found in the world.", "#F66");
    }
  }

  // Add a camera to the world
  addCamera(camera: ICamera): void {
    this.cameras.push(camera);
    if (!this.activeCamera) {
      this.setActiveCamera(camera); // Set the first added camera as active by default
    }
  }

  load(): void {}

  // Draw all static meshes in the world
  draw(): void {
    if (!this.activeCamera) {
      Log("WARNING: No active camera set.", "#ff0");
    }

    this.shaderProgram.use();

    this.drawGrid();

    this.staticMeshes.forEach((mesh) => {
      mesh.draw();
    });
  }

  // Create the grid data
  createGrid(): void {
    const vertices: number[] = [];
    const colors: number[] = [];

    // Generate grid lines
    for (let i = -this.gridSize; i <= this.gridSize; i++) {
      // Vertical lines (Z-axis)
      vertices.push(i, 0, -this.gridSize, i, 0, this.gridSize);
      colors.push(...this.gridColor, ...this.gridColor);

      // Horizontal lines (X-axis)
      vertices.push(-this.gridSize, 0, i, this.gridSize, 0, i);
      colors.push(...this.gridColor, ...this.gridColor);
    }
    // Axis lines (X=red, Y=green, Z=blue) for visual debugging
    vertices.push(
      -this.gridSize, 0, 0, this.gridSize, 0, 0,  // X-axis
      // 0, -this.gridSize, 0, 0, this.gridSize, 0,  // Z-axis
      0, 0, -this.gridSize, 0, 0, this.gridSize   // Y-axis
    );
    colors.push( // opengl is invertex x with z
      1, 0, 0, 1, 1, 0.6, 0.6, 1, // X-axis red
      0, 0, 1, 1, 0.2, 0.8, 1, 1, // Z-axis blue
      0, 1, 0, 1, 0.6, 1, 0.6, 1, // Y-axis green
    );

    this.gridVertices = new Float32Array(vertices);
    this.gridColors = new Float32Array(colors);
  }

  // Draw the grid for the world
  drawGrid(): void {
    // Bind and set vertex data
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.gridVertices,
      this.gl.STATIC_DRAW
    );
    // Bind and set color data
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.gridColors,
      this.gl.STATIC_DRAW
    );

    // Bind vertex buffer and set attribute pointer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    const positionLocation = this.shaderProgram.getAttributeLocation("a_position");
    this.gl.vertexAttribPointer(
      positionLocation, 3, this.gl.FLOAT, false, 0, 0
    );
    this.gl.enableVertexAttribArray(positionLocation);

    // Bind color buffer and set attribute pointer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    const colorLocation = this.shaderProgram.getAttributeLocation("a_color");
    this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(colorLocation);

    // Draw the grid
    this.gl.drawArrays(this.gl.LINES, 0, this.gridVertices.length / 3);

    // Cleanup
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  logWorldState(): void {
    Log("World State: -------------------------------------------", "#0FF", 6, true);
    Log(`Number of Static Meshes: ${this.staticMeshes.length}`,     "#0FF", 6, true);
    Log(`Number of Cameras:       ${this.cameras.length}`,          "#0FF", 6, true);
    Log(`Directional Light:       ${this.directionalLight}`,        "#0FF", 6, true);
    Log(`Ambient Light:           ${this.ambientlight}`,            "#0FF", 6, true);
    Log(`Number of Point Lights:  ${this.pointLights.length}`,      "#0FF", 6, true);
    Log(`Number of Spot Lights:   ${this.spotLights.length}`,       "#0FF", 6, true);
    Log(`Active Camera:           ${this.activeCamera}`,            "#0FF", 6, true);
  }

  destroy(): void {
    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.colorBuffer);
    // Additional cleanup logic
  }
  
}
