import { IShaderProgram, IStaticMesh } from "@/interfaces/EngineInterfaces";
import { VertexAttributeDefinition } from "@/interfaces/GLInterfaces";
import { mat3, mat4, vec3, vec4 } from "gl-matrix";

export class StaticMesh implements IStaticMesh {
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

  constructor(
    gl: WebGLRenderingContext,
    shaderProgram: IShaderProgram,
    vertices: Float32Array,
    attributes: VertexAttributeDefinition[],
    vertexCount: number,
    b_showWireframe: boolean = false,
    b_showPoints: boolean = false,
    pointSize: number = 5.0,
    indices: Uint16Array | null = null,
    drawingMode: GLenum = gl.TRIANGLES,
  ) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;

    this.vertices = vertices;
    this.attributes = attributes;
    this.indices = indices;
    this.vertexCount = vertexCount;

    this.b_showWireframe = b_showWireframe;
    this.b_showPoints = b_showPoints;
    this.wireframeColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.pointColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.pointSize = pointSize;

    this.vertexBuffer = null;
    this.indexBuffer = null;

    this.drawingMode = drawingMode;
    this.modelMatrix = mat4.create();

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
  translate(vector: vec3): void {
    mat4.translate(this.modelMatrix, this.modelMatrix, vector);
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
  setShowWireframe(value: boolean): void {
    this.b_showWireframe = value;
  }
  setShowPonits(value: boolean): void {
    this.b_showPoints = value;
  }
  setWireframeColor(color: vec4): void {
    this.wireframeColor = color;
  }
  setPointColor(color: vec4): void {
    this.pointColor = color;
  }
  
  public draw(): void {
    this.shaderProgram.use(); // Use the assigned shader program

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer); // Bind the vertex data buffer

    this.shaderProgram.setUniformMatrix4fv("u_modelMatrix", this.modelMatrix); // Set the model matrix

    // Compute and pass normal matrix
    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, this.modelMatrix);
    this.shaderProgram.setUniformMatrix3fv("u_normalMatrix", normalMatrix);

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

    if (this.b_showWireframe) {
      this.shaderProgram.setUniform4fv("u_color", this.wireframeColor);
      this.gl.drawArrays(
        this.gl.LINE_STRIP,
        0,
        this.vertexCount
      )
      this.shaderProgram.setUniform4fv("u_color", vec4.fromValues(0.0, 0.0, 0.0, 0.0));
    }
    if (this.b_showPoints) {
      this.shaderProgram.setUniform4fv("u_color", this.pointColor);
      this.shaderProgram.setUniform1f("u_pointSize", this.pointSize);
      this.gl.drawArrays(
        this.gl.POINTS,
        0,
        this.vertexCount
      )
      this.shaderProgram.setUniform4fv("u_color", vec4.fromValues(0.0, 0.0, 0.0, 0.0));
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
