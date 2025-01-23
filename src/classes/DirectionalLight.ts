import { IDirectionalLight } from "@/interfaces/EngineInterfaces";
import { vec3 } from "gl-matrix";

export default class DirectionLight implements IDirectionalLight {
  direction: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
  color: vec3 = [0.0, 0.0, 0.0];
  intensity: number = 1;
  castShadows?: boolean = true;

  constructor(color: vec3, direction: vec3, intensity: number) {
    this.color = color;
    this.intensity = intensity;
    this.direction = direction;
  }
}
