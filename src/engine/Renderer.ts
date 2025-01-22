import { IRenderer, IWebGLCanvas } from "@/interfaces/engine_interfaces";
import { Log, setFps } from "../utils/Overlays";

export class Renderer implements IRenderer {
  webglCanvas: IWebGLCanvas;
  lastTime: number;
  inputState: {
    keys: Record<string, boolean>;
    mouse: { x: number; y: number; isDown: boolean };
  };

  // Constructor
  constructor(webglCanvas: IWebGLCanvas) {
    this.webglCanvas = webglCanvas;
    this.lastTime = 0;

    this.inputState = {
      keys: {}, // Track pressed keys
      mouse: { x: 0, y: 0, isDown: false }, // Track mouse state
    };

    this.bindInputHandlers();
  }

  bindInputHandlers(): void {
    // Keyboard input
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.inputState.keys[event.code] = true;
      Log(event.code);
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      this.inputState.keys[event.code] = false;
    });

    // Mouse input
    this.webglCanvas.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = this.webglCanvas.canvas.getBoundingClientRect();
      this.inputState.mouse.x = event.clientX - rect.left;
      this.inputState.mouse.y = event.clientY - rect.top; 
    });

    this.webglCanvas.canvas.addEventListener("mousedown", () => {
      this.inputState.mouse.isDown = true;
    });

    this.webglCanvas.canvas.addEventListener("mouseup", () => {
      this.inputState.mouse.isDown = false;
    });
  }

  start(): void {
    Log("Renderer Started!", "#0f0");
    this.lastTime = performance.now();

    this.webglCanvas.load();

    this.animate();
  }

  animate(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    const fps = Math.round(1 / deltaTime); // FPS calculation
    setFps(fps, deltaTime);

    // Game loop
    this.processInput(deltaTime); // Input processing
    this.webglCanvas.update(); // Update
    this.webglCanvas.render(); // Render the scene

    requestAnimationFrame(() => this.animate()); // Request the next frame
  }

  processInput(deltaTime: number): void {
    // Example: Move an object when arrow keys are pressed
    if (this.inputState.keys["ArrowUp"]) {
      console.log("Move Up");
    }
    if (this.inputState.keys["ArrowDown"]) {
      console.log("Move Down");
    }
    if (this.inputState.keys["ArrowLeft"]) {
      console.log("Move Left");
    }
    if (this.inputState.keys["ArrowRight"]) {
      console.log("Move Right");
    }

    // Example: Log mouse position and button state
    if (this.inputState.mouse.isDown) {
      // Log(`Mouse Down at (${this.inputState.mouse.x}, ${this.inputState.mouse.y})`);
    }
  }
}
