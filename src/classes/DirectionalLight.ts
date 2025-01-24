import { IDirectionalLight } from "@/interfaces/EngineInterfaces";
import { vec3 } from "gl-matrix";

export default class DirectionalLight implements IDirectionalLight {
  direction: vec3 = vec3.normalize(vec3.create(), vec3.fromValues(1.0, -1.0, 1.0));
  color: vec3 = [1.0, 1.0, 1.0];
  intensity: number = 1;
  castShadows: boolean = true;

  constructor(color: vec3, direction?: vec3, intensity?: number) {
    this.color = color;
    this.intensity = intensity ? intensity : 1;
    this.direction = direction ? vec3.normalize(vec3.create(), direction) : [1.0, 0, 0];
  }
}
