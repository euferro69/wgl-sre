import { IShaderProgram } from "@/interfaces/EngineInterfaces";
import { Log } from "@/utils/Logging";
import { mat3, mat4, vec3, vec4 } from "gl-matrix";

export class ShaderProgram implements IShaderProgram{
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;
  
    constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
      Log("Compiling Shaders...", "#fff", 2, true);
      this.gl = gl;
  
      // Compile shaders
      const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  
      // Link the program
      this.program = this.createProgram(vertexShader, fragmentShader);
      Log("Shaders Compiled Successfully!", "#0f0", 2, true);
    }
  
    // Compile a shader (vertex or fragment)
    createShader(type: GLenum, source: string): WebGLShader {
      const shader = this.gl.createShader(type);
      if (!shader) {
        throw new Error(`Unable to create shader of type: ${type}`);
      }
  
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
  
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        const error = this.gl.getShaderInfoLog(shader);
        this.gl.deleteShader(shader);
        throw new Error(`Failed to compile shader: ${error}`);
      }
  
      return shader;
    }
  
    // Link vertex and fragment shaders into a program
    createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
      const program = this.gl.createProgram();
      if (!program) {
        throw new Error("Unable to create WebGL program");
      }
  
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);
  
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        const error = this.gl.getProgramInfoLog(program);
        this.gl.deleteProgram(program);
        throw new Error(`Failed to link program: ${error}`);
      }
  
      // Clean up shaders (they are no longer needed after linking)
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);
  
      return program;
    }
  
    // Use the program in the WebGL context
    use(): void {
      this.gl.useProgram(this.program);
    }
  
    // Get the location of an attribute
    getAttributeLocation(name: string): number {
      const location = this.gl.getAttribLocation(this.program, name);
      if (location === -1) {
        throw new Error(`Attribute "${name}" not found in shader program`);
      }
      return location;
    }
  
    // Get the location of a uniform
    getUniformLocation(name: string): WebGLUniformLocation {
      const location = this.gl.getUniformLocation(this.program, name);
      if (!location) {
        throw new Error(`Uniform "${name}" not found in shader program`);
      }
      return location;
    }
  
    // Set uniform matrices
    setUniformMatrix4fv(name: string, value: mat4): void {
      const location = this.getUniformLocation(name);
      this.gl.uniformMatrix4fv(location, false, value);
    }
    setUniformMatrix3fv(name: string, value: mat3): void {
      const location = this.getUniformLocation(name);
      this.gl.uniformMatrix3fv(location, false, value);
    }

    // Upload scalars and vectors
    setUniform1i(name: string, value: number): void {
      const location = this.getUniformLocation(name);
      this.gl.uniform1i(location, value);
    }
    setUniform1f(name: string, value: number): void {
      const location = this.getUniformLocation(name);
      this.gl.uniform1f(location, value);
    }
    setUniform3fv(name: string, value: vec3): void {
      const location = this.getUniformLocation(name);
      this.gl.uniform3fv(location, value);
    }
    setUniform4fv(name: string, value: vec4): void {
      const location = this.getUniformLocation(name);
      this.gl.uniform4fv(location, value);
    }

    // Texture support
    setUniformSampler2D(name: string, textureUnit: number): void {
      throw new Error("Method not implemented.");
    }
    bindTexture(textureUnit: number, texture: WebGLTexture): void {
      throw new Error("Method not implemented.");
    }
    unbindTexture(textureUnit: number): void {
      throw new Error("Method not implemented.");
    }
  
    // Cleanup the program
    delete(): void {
      if (this.program) {
        this.gl.deleteProgram(this.program);
      }
    }
  }
  