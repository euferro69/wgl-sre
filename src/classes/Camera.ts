import { mat4 } from "gl-matrix"; // Assuming you're using gl-matrix for matrix operations.

export class Camera {
  private projectionMatrix: mat4;
  private viewMatrix: mat4;
  private position: [number, number, number];
  private target: [number, number, number];
  private up: [number, number, number];
  private fov: number; // Field of View in degrees for perspective mode
  private aspect: number; // Aspect ratio
  private near: number; // Near clipping plane
  private far: number; // Far clipping plane
  private mode: "perspective" | "orthographic" | "2d";

  constructor(
    mode: "perspective" | "orthographic" | "2d" = "perspective",
    position: [number, number, number] = [0, 0, 5],
    target: [number, number, number] = [0, 0, 0],
    up: [number, number, number] = [0, 1, 0],
    fov: number = 45,
    aspect: number = 1,
    near: number = 0.1,
    far: number = 100
  ) {
    this.mode = mode;
    this.position = position;
    this.target = target;
    this.up = up;
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.updateProjectionMatrix();
    this.updateViewMatrix();
  }

  // Update projection matrix based on the current mode
  private updateProjectionMatrix(): void {
    if (this.mode === "perspective") {
      mat4.perspective(
        this.projectionMatrix,
        (this.fov * Math.PI) / 180, // Convert FOV to radians
        this.aspect,
        this.near,
        this.far
      );
    } else if (this.mode === "orthographic") {
      const orthoSize = 10; // Fixed orthographic size
      mat4.ortho(
        this.projectionMatrix,
        -orthoSize * this.aspect,
        orthoSize * this.aspect,
        -orthoSize,
        orthoSize,
        this.near,
        this.far
      );
    } else if (this.mode === "2d") {
      mat4.ortho(
        this.projectionMatrix,
        0,
        this.aspect, // Right corresponds to aspect ratio
        0,
        1, // Top corresponds to normalized device coordinates
        -1,
        1
      );
    }
  }

  // Update view matrix based on the camera's position, target, and up direction
  private updateViewMatrix(): void {
    mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
  }

  // Change the camera's mode
  setMode(mode: "perspective" | "orthographic" | "2d"): void {
    this.mode = mode;
    this.updateProjectionMatrix();
  }

  // Update the aspect ratio (e.g., on window resize)
  setAspect(aspect: number): void {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }

  // Set camera position
  setPosition(position: [number, number, number]): void {
    this.position = position;
    this.updateViewMatrix();
  }

  // Set camera target
  setTarget(target: [number, number, number]): void {
    this.target = target;
    this.updateViewMatrix();
  }

  // Set Field of View
  setFov(fov: number): void {
    this.fov = fov;
    this.updateProjectionMatrix();
  }

  // Get the projection matrix
  getProjectionMatrix(): mat4 {
    return this.projectionMatrix;
  }

  // Get the view matrix
  getViewMatrix(): mat4 {
    return this.viewMatrix;
  }

  // Get the combined view-projection matrix
  getViewProjectionMatrix(): mat4 {
    const viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
    return viewProjectionMatrix;
  }
}
