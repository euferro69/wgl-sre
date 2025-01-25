import { IInputManager } from "@/interfaces/EngineInterfaces";
import { Log } from "@/utils/Logging";

export class InputManager implements IInputManager {
  canvas: HTMLCanvasElement;
  inputState: {
    keys: Record<string, boolean>;
    mouse: {
      x: number; y: number;
      lastX: number; lastY: number;
      isDown: boolean
    };
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // Input handling
    this.inputState = {
      keys: {}, // Track pressed keys
      mouse: { x: 0, y: 0, lastX: 0, lastY: 0, isDown: false }, // Track mouse state
    };
    this.bindInputHandlers();
  }

  bindInputHandlers(): void {
    // Keyboard input
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.inputState.keys[event.code] = true;
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      this.inputState.keys[event.code] = false;
    });

    // Mouse input
    this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.inputState.mouse.x = event.clientX - rect.left;
      this.inputState.mouse.y = event.clientY - rect.top;
      // Log(`mouse: { x: ${this.getMouseX()}, y: ${this.getMouseY()}, lastX: ${JSON.stringify(this.getMouseDelta())} }`);
    });

    this.canvas.addEventListener("mousedown", () => {
      this.inputState.mouse.isDown = true;
    });

    this.canvas.addEventListener("mouseup", () => {
      this.inputState.mouse.isDown = false;
    });
  }

  isKeyPressed(keyCode: string): boolean {
    return this.inputState.keys[keyCode];
  }

  isMouseDown(): boolean {
    return this.inputState.mouse.isDown;
  }

  getMouseX(): number {
    return this.inputState.mouse.x;
  }
  getMouseY(): number {
    return this.inputState.mouse.y;
  }

  getMouseDelta(): { deltaX: number, deltaY: number } {
    return {
      deltaX: this.inputState.mouse.x - this.inputState.mouse.lastX,
      deltaY: this.inputState.mouse.y - this.inputState.mouse.lastY
    }
  }

  setMouseLastXY(lastX: number, lastY: number): void {
    this.inputState.mouse.lastX = lastX;
    this.inputState.mouse.lastY = lastY;
  }

  processInput(deltaTime: number): void {
    // Example: Move an object when arrow keys are pressed
    if (this.isKeyPressed("ArrowUp")) {
      Log("Move Up");
    }
    if (this.isKeyPressed("ArrowDown")) {
      Log("Move Down");
    }
    if (this.isKeyPressed("ArrowLeft")) {
      Log("Move Left");
    }
    if (this.isKeyPressed("ArrowRight")) {
      Log("Move Right");
    }

    // Example: Log mouse position and button state
    if (this.inputState.mouse.isDown) {
      // Log(`Mouse Down at (${this.inputState.mouse.x}, ${this.inputState.mouse.y})`);
    }
  }
}
