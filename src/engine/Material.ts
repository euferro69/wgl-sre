import { IMaterial } from "../interfaces/EngineInterfaces";
import { IShaderProgram } from "@/interfaces/EngineInterfaces";
import { vec3 } from "gl-matrix";
import { ShaderProgram } from "./ShaderProgram";

export class Material implements IMaterial {
  gl: WebGLRenderingContext;
  shaderProgram: ShaderProgram;
  name: string;
  albedo: vec3;
  metallic: number;
  roughness: number;
  specularColor: vec3;
  specularIntensity: number;
  ao: number;
  emissive: vec3;
  alpha: number;

  albedoTexture?: WebGLTexture;
  metallicRoughnessTexture?: WebGLTexture;
  aoTexture?: WebGLTexture;
  emissiveTexture?: WebGLTexture;
  normalMap?: WebGLTexture;

  constructor(
    gl: WebGLRenderingContext,
    shaderProgram: ShaderProgram,
    name: string,
    albedo: vec3 = vec3.fromValues(1.0, 1.0, 1.0),
    metallic: number = 0.0,
    roughness: number = 0.5,
    specularColor: vec3 = [1.0, 1.0, 1.0],
    specularIntensity: number = 0.5,
    ao: number = 1.0,
    emissive: vec3 = vec3.fromValues(0.0, 0.0, 0.0),
    alpha: number = 1.0,
    albedoTexture?: WebGLTexture,
    metallicRoughnessTexture?: WebGLTexture,
    aoTexture?: WebGLTexture,
    emissiveTexture?: WebGLTexture,
    normalMap?: WebGLTexture
  ) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.name = name;
    this.albedo = albedo;
    this.metallic = metallic;
    this.roughness = roughness;
    this.specularColor = specularColor;
    this.specularIntensity = specularIntensity;
    this.ao = ao;
    this.emissive = emissive;
    this.alpha = alpha;

    this.albedoTexture = albedoTexture;
    this.metallicRoughnessTexture = metallicRoughnessTexture;
    this.aoTexture = aoTexture;
    this.emissiveTexture = emissiveTexture;
    this.normalMap = normalMap;
  }

  bind(gl: WebGLRenderingContext, shader: IShaderProgram): void {
    shader.setUniform3fv("u_albedo", this.albedo);
    shader.setUniform1f("u_metallic", this.metallic);
    shader.setUniform1f("u_roughness", this.roughness);
    shader.setUniform1f("u_ao", this.ao);
    shader.setUniform3fv("u_emissive", this.emissive);
    shader.setUniform1f("u_alpha", this.alpha);

    // // Bind textures if available
    // if (this.albedoTexture) shader.setTexture("u_albedoTexture", this.albedoTexture, 0);
    // if (this.metallicRoughnessTexture) shader.setTexture("u_metallicRoughnessTexture", this.metallicRoughnessTexture, 1);
    // if (this.aoTexture) shader.setTexture("u_aoTexture", this.aoTexture, 2);
    // if (this.emissiveTexture) shader.setTexture("u_emissiveTexture", this.emissiveTexture, 3);
    // if (this.normalMap) shader.setTexture("u_normalMap", this.normalMap, 4);
  }
}
