import { COORD_SYS_UP, ICamera } from "@/interfaces/EngineInterfaces";
import { Log } from "@/utils/Logging";
import { mat4, vec3 } from "gl-matrix";

export class Camera implements ICamera {
  // Matrices
  projectionMatrix: mat4;
  viewMatrix: mat4;
  rotationMatrix: mat4;
  // Parameters
  position: vec3;
  target: vec3;
  up: vec3;
  fov: number; // Field of View in degrees (for perspective mode)
  aspect: number; // Aspect ratio
  near: number; // Near clipping plane
  far: number; // Far clipping plane
  mode: "perspective" | "orthographic";
  pitch: number;
  yaw: number;
  roll: number;

  constructor(
    mode: "perspective" | "orthographic" = "perspective",
    position: vec3 = vec3.fromValues(5, 2, 5),
    target: vec3 = vec3.fromValues(0, 0, 0),
    up: vec3 = vec3.fromValues(0, 1, 0),
    fov: number = 90,
    aspect: number = 1,
    near: number = 0.1,
    far: number = 100,
    rotationMatrix: mat4 = mat4.create(),
    pitch: number = 0,
    yaw: number = 0,
    roll: number = 0,
  ) {
    this.mode = mode;
    this.position = vec3.clone(position);
    this.target = vec3.clone(target);
    this.up = vec3.clone(up);
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.rotationMatrix = rotationMatrix;
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;

    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.updateProjectionMatrix();
    this.updateViewMatrix();
  }

  // Update the projection matrix based on the camera mode
  updateProjectionMatrix(): void {
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
    }
  }

  // Update the view matrix based on the position, target, and up vector
  updateViewMatrix(): void {
    mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);

    // Fix the UP vector to always point upwards
    this.up = vec3.fromValues(0, 1, 0); // TODO FIND BETTER WAY THEN RESET UP VECTOR TO ALWAYS BE THE GLOBAL COODINATE SYSTEM UP
  }

  // Change the camera's mode and update the projection matrix
  setMode(mode: "perspective" | "orthographic"): void {
    this.mode = mode;
    this.updateProjectionMatrix();
  }

  // Update the aspect ratio (e.g., when resizing the window)
  setAspect(aspect: number): void {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }

  // Set the camera position
  setPosition(position: vec3): void {
    vec3.copy(this.position, position);
    this.updateViewMatrix();
  }

  // Set the camera target
  setTarget(target: vec3): void {
    vec3.copy(this.target, target);
    this.updateViewMatrix();
  }

  // Set the Field of View (for perspective mode only)
  setFov(fov: number): void {
    this.fov = Math.max(10, Math.min(120, fov)); // Clamp between 10 and 120
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

  public moveForward(amount: number): void {
    const forward = vec3.create();
    vec3.subtract(forward, this.target, this.position);
    vec3.normalize(forward, forward);
    vec3.scaleAndAdd(this.position, this.position, forward, amount);
    vec3.scaleAndAdd(this.target, this.target, forward, amount);
    this.updateViewMatrix();
  }

  public moveRight(amount: number): void {
    const forward = vec3.create();
    vec3.subtract(forward, this.target, this.position);
    const right = vec3.create();
    vec3.cross(right, forward, this.up);
    vec3.normalize(right, right);
    vec3.scaleAndAdd(this.position, this.position, right, amount);
    vec3.scaleAndAdd(this.target, this.target, right, amount);
    this.updateViewMatrix();
  }

  public moveUp(amount: number): void {
    vec3.scaleAndAdd(this.position, this.position, this.up, amount);
    vec3.scaleAndAdd(this.target, this.target, this.up, amount);
    this.updateViewMatrix();
  }

  // Rotate the camera around the target
  public rotate(axis: vec3, angle: number): void {
    mat4.rotate(this.rotationMatrix, mat4.create(), angle, axis);

    const direction = vec3.create();
    vec3.subtract(direction, this.position, this.target);

    const rotatedDirection = vec3.create();
    vec3.transformMat4(rotatedDirection, direction, this.rotationMatrix);

    vec3.add(this.position, this.target, rotatedDirection);

    this.updateViewMatrix();
    mat4.identity(this.rotationMatrix);
  }

  public setRoll(angle: number): void {
    this.roll += angle;
    const forward = vec3.create();
    const radians = angle * (Math.PI / 180);
    vec3.subtract(forward, this.target, this.position);
    vec3.normalize(forward, forward);

    mat4.rotate(this.rotationMatrix, mat4.create(), radians, forward);

    vec3.transformMat4(this.up, this.up, this.rotationMatrix);
    vec3.normalize(this.up, this.up);
    this.updateViewMatrix();
    mat4.identity(this.rotationMatrix);
    // Log(`Row: ${this.roll}`, "#0FF");
  }

  public setYaw(angle: number): void {
    this.yaw += angle;
    const radians = angle * (Math.PI / 180);
  
    // Compute forward direction
    const forward = vec3.create();
    vec3.subtract(forward, this.target, this.position);
    vec3.normalize(forward, forward);
  
    // Compute right vector
    const right = vec3.create();
    vec3.cross(right, forward, COORD_SYS_UP);
    vec3.normalize(right, right);
  
    // Apply the rotation
    mat4.rotate(this.rotationMatrix, mat4.create(), radians, COORD_SYS_UP);
    // Apply the rotation to the forward vector
    vec3.transformMat4(forward, forward, this.rotationMatrix);
  
    // Update the target based on the rotated forward vector
    vec3.add(this.target, this.position, forward);
    this.updateViewMatrix();

    mat4.identity(this.rotationMatrix);
  }
  
  public setPitch(angle: number): void {
    this.pitch = Math.max(-85, Math.min(85, this.pitch));
    const right = vec3.create();
    const radians = angle * (Math.PI / 180);
  
    // Calculate the forward vector
    const forward = vec3.create();
    vec3.subtract(forward, this.target, this.position);
    vec3.normalize(forward, forward);
  
    // Calculate the right vector (cross product of forward and up vectors)
    vec3.cross(right, forward, this.up);
    vec3.normalize(right, right);
  
    // Create a rotation matrix around the 'right' vector
    mat4.rotate(this.rotationMatrix, mat4.create(), radians, right);
  
    // Apply the rotation to the forward vector and the up vector
    vec3.transformMat4(forward, forward, this.rotationMatrix);
    vec3.transformMat4(this.up, this.up, this.rotationMatrix);
  
    // Update the target based on the rotated forward vector
    vec3.add(this.target, this.position, forward);
    this.updateViewMatrix();
    mat4.identity(this.rotationMatrix);
  }

  public lookAt(target: vec3): void {
    vec3.copy(this.target, target);
    this.updateViewMatrix();
  }

  public autoAdjustAspect(canvas: HTMLCanvasElement): void {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.setAspect(aspect);
  }

  public logCameraState(): void {
    console.log("Camera State:");
    console.log("Position:", this.position);
    console.log("Target:", this.target);
    console.log("Up:", this.up);
    console.log("Projection Matrix:", this.projectionMatrix);
    console.log("View Matrix:", this.viewMatrix);
  }

}
