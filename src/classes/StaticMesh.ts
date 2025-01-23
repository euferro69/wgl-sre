import { IShaderProgram, IStaticMesh } from "@/interfaces/EngineInterfaces";
import { VertexAttributeDefinition } from "@/interfaces/GLInterfaces";

export class StaticMesh implements IStaticMesh {
  gl: WebGLRenderingContext;
  vertices: Float32Array;
  vertexBuffer: WebGLBuffer | null;
  attributes: {
    name: string;
    size: number;
    type: GLenum;
    normalized: boolean;
    stride: number;
    offset: number;
  }[];
  shaderProgram: IShaderProgram;
  mode: GLenum;
  count: number;

  constructor(
    gl: WebGLRenderingContext,
    vertices: Float32Array,
    attributes: VertexAttributeDefinition[],
    count: number,
    shaderProgram: IShaderProgram,
    mode: GLenum = gl.TRIANGLES
  ) {
    this.gl = gl;
    this.vertices = vertices;
    this.attributes = attributes;
    this.vertexBuffer = null;
    this.shaderProgram = shaderProgram;
    this.mode = mode;
    this.count = count;

    this.createBuffer();
  }
    setShaderProgram(shaderProgram: IShaderProgram): void {
        throw new Error("Method not implemented.");
    }

  // Create the vertex buffer and load data into it
  private createBuffer(): void {
    this.vertexBuffer = this.gl.createBuffer();
    if (!this.vertexBuffer) {
      throw new Error("Failed to create vertex buffer");
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertices,
      this.gl.STATIC_DRAW
    );
  }

  // Set the rendering mode (e.g., TRIANGLES, LINES, LINE_STRIP, etc.)
  public setMode(mode: GLenum): void {
    this.mode = mode;
  }

  // Draw the mesh
  public draw(): void {
    this.shaderProgram.use(); // Use the assigned shader program

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    // Enable and set up attributes
    this.attributes.forEach((attr) => {
      const location = this.shaderProgram.getAttributeLocation(attr.name);
      this.gl.enableVertexAttribArray(location);
      this.gl.vertexAttribPointer(
        location,
        attr.size,
        attr.type,
        attr.normalized,
        attr.stride,
        attr.offset
      );
    });

    // Draw the mesh
    this.gl.drawArrays(this.mode, 0, this.count);

    // Disable attributes after drawing
    this.attributes.forEach((attr) => {
      const location = this.shaderProgram.getAttributeLocation(attr.name);
      this.gl.disableVertexAttribArray(location);
    });
  }

  // Update vertex data
  public updateVertices(newVertices: Float32Array): void {
    this.vertices = newVertices;
    this.createBuffer(); // Recreate the buffer with new data
  }

  // Assign a custom shader program to this mesh
  public setCustomShaderProgram(shaderProgram: IShaderProgram): void {
    this.shaderProgram = shaderProgram;
  }

  // Clean up WebGL resources
  public delete(): void {
    if (this.vertexBuffer) {
      this.gl.deleteBuffer(this.vertexBuffer);
      this.vertexBuffer = null;
    }
  }
}
