import { IShaderProgram, IStaticMesh } from "@/interfaces/EngineInterfaces";
import { VertexAttributeDefinition } from "@/interfaces/GLInterfaces";
import { mat4, vec3 } from "gl-matrix";

export class StaticMesh implements IStaticMesh {
  gl: WebGLRenderingContext;
  vertices: Float32Array;
  vertexBuffer: WebGLBuffer | null;
  indices: Uint16Array | null;
  indexBuffer: WebGLBuffer | null = null;
  attributes: {
    name: string;
    size: number;
    type: GLenum;
    normalized: boolean;
    stride: number;
    offset: number;
  }[];
  shaderProgram: IShaderProgram;
  drawingMode: GLenum;
  vertexCount: number;
  modelMatrix: mat4;

  constructor(
    gl: WebGLRenderingContext,
    vertices: Float32Array,
    attributes: VertexAttributeDefinition[],
    count: number,
    shaderProgram: IShaderProgram,
    indices: Uint16Array | null = null,
    drawingMode: GLenum = gl.TRIANGLES,
    modelMatrix: mat4 = mat4.create(),
  ) {
    this.gl = gl;
    this.vertices = vertices;
    this.attributes = attributes;
    this.vertexBuffer = null;
    this.shaderProgram = shaderProgram;
    this.drawingMode = drawingMode;
    this.vertexCount = count;
    this.modelMatrix = modelMatrix;

    this.indices = indices;

    this.createVertexBuffer();
    this.createIndexBuffer();
  }

  // Assign a custom shader program to this mesh
  setShaderProgram(shaderProgram: IShaderProgram): void {
    this.shaderProgram = shaderProgram;
  }

  // Vertex Data and Indexes
  setVertices(newVertices: Float32Array): void {
    this.vertices = newVertices;
    this.createVertexBuffer(); // Recreate the buffer with new data
  }
  setIndices(newIndices: Uint16Array): void {
    throw new Error("Method not implemented.");
  }

  // Create the vertex/index buffer and load data into it
  createVertexBuffer(): void {
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
  createIndexBuffer(): void {
    if (!this.indices) return;
    this.indexBuffer = this.gl.createBuffer();
    if (!this.indexBuffer) {
      throw new Error("Failed to create index buffer");
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
  }

  // Transformations
  translate(worldPos: vec3): void {
    mat4.translate(this.modelMatrix, this.modelMatrix, worldPos);
  }
  rotate(angle: number, axis: vec3): void {
    const radians = angle * (Math.PI / 180);
    mat4.rotate(this.modelMatrix, this.modelMatrix, radians, axis);
  }
  scale(scale: vec3): void {
    mat4.scale(this.modelMatrix, this.modelMatrix, scale);
  }

  // Drawing
  public setDrawingMode(mode: GLenum): void {
    this.drawingMode = mode;
  }
  public draw(): void {
    this.shaderProgram.use(); // Use the assigned shader program

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    this.shaderProgram.setUniformMatrix4fv("u_modelMatrix", this.modelMatrix); // Set the model matrix

    // Enable and set up attributes on shader
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

    // If there are indices draw using them oterwise use draw arrays
    if (this.indices && this.indexBuffer) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      this.gl.drawElements(
        this.drawingMode,
        this.indices.length,
        this.gl.UNSIGNED_SHORT,
        0 // offset
      );
    } else {
      this.gl.drawArrays(
        this.drawingMode,
        0, // offset
        this.vertexCount
      );
    }

    // Disable attributes after drawing
    this.attributes.forEach((attr) => {
      const location = this.shaderProgram.getAttributeLocation(attr.name);
      this.gl.disableVertexAttribArray(location);
    });
  }

  // Clean up WebGL resources
  public delete(): void {
    if (this.vertexBuffer) {
      this.gl.deleteBuffer(this.vertexBuffer);
      this.vertexBuffer = null;
    }
    if (this.indexBuffer) {
      this.gl.deleteBuffer(this.indexBuffer);
      this.indexBuffer = null;
    }
  }
}
