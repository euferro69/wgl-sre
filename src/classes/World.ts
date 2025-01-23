import { mat4, vec4 } from "gl-matrix";
import { IStaticMesh, IWorld } from "@/interfaces/EngineInterfaces";
import { ICamera } from "@/interfaces/EngineInterfaces";
import { IShaderProgram } from "@/interfaces/EngineInterfaces";
import { Log } from "@/utils/Logging";
import { ShaderProgram } from "@/engine/ShaderProgram";

export class World implements IWorld {
  gl: WebGLRenderingContext;
  // Objects in the world
  staticMeshes: IStaticMesh[];
  cameras: ICamera[];
  activeCamera: ICamera | null;
  // Default Shader
  shaderProgram: ShaderProgram;
  // Grid
  gridVertices: Float32Array;
  gridColors: Float32Array;
  gridSize: number = 10; // Size of the grid (10x10 squares)
  gridColor: number[] = [0.5, 0.5, 0.5, 1.0]; // Default grid line color
  vertexBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext, shaderProgram: ShaderProgram) {
    this.gl = gl;
    this.staticMeshes = [];
    this.cameras = [];
    this.activeCamera = null;
    // Shader
    this.shaderProgram = shaderProgram;
    // Grid
    this.gridVertices = new Float32Array();
    this.gridColors = new Float32Array();
    this.vertexBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();

    this.createGrid();
    this.logWorldState();
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

  // Add a camera to the world
  addCamera(camera: ICamera): void {
    this.cameras.push(camera);
    if (!this.activeCamera) {
      this.activeCamera = camera; // Set the first added camera as active by default
    }
  }

  // Set the active camera
  setActiveCamera(camera: ICamera): void {
    if (this.cameras.includes(camera)) {
      this.activeCamera = camera;
    } else {
      throw new Error("Camera not found in the world.");
    }
  }

  // Draw all static meshes in the world
  draw(): void {
    if (!this.activeCamera) {
      Log("WARNING: No active camera set.", "#ff0");
    }
    this.shaderProgram.use();
    const viewMatrix = this.activeCamera?.getViewMatrix();
    const projectionMatrix = this.activeCamera?.getProjectionMatrix();

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
      0, -this.gridSize, 0, 0, this.gridSize, 0,  // Y-axis
      0, 0, -this.gridSize, 0, 0, this.gridSize   // Z-axis
    );
    colors.push(
      1, 0, 0, 1, 1, 0, 0, 1, // X-axis red
      0, 1, 0, 1, 0, 1, 0, 1, // Y-axis green
      0, 0, 1, 1, 0, 0, 1, 1 // Z-axis blue
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

    this.shaderProgram.setUniformMatrix4fv(
      "u_viewMatrix",
      this.activeCamera?.getViewMatrix() as Float32Array
    );
    this.shaderProgram.setUniformMatrix4fv(
      "u_projectionMatrix",
      this.activeCamera?.getProjectionMatrix() as Float32Array
    );

    // Draw the grid
    this.gl.drawArrays(this.gl.LINES, 0, this.gridVertices.length / 3);

    // Cleanup
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  logWorldState(): void {
    Log("World State: -------------------------------------------", "", 6, true);
    Log(`Number of Static Meshes: ${this.staticMeshes.length}`,     "", 6, true);
    Log(`Number of Cameras:       ${this.cameras.length}`,          "", 6, true);
    Log(`Active Camera:           ${this.activeCamera}`,            "", 6, true);
  }

  destroy(): void {
    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.colorBuffer);
    // Additional cleanup logic
  }
  
}
