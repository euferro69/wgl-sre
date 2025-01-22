"use client";

import { useEffect, useRef } from "react";
import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";
// Engine
import { InputManager } from "@/engine/InputManager";
import { Renderer } from "@/engine/Renderer";
import { ShaderProgram } from "@/engine/ShaderProgram";
import { vertexShaderSource } from "../shaders/vertexShader";
import { fragmentShaderSource } from "../shaders/fragmentShader";
import { playAudio } from "@/utils/Audio";
import { Button } from "@mui/material";
import { Camera } from "@/classes/Camera";
import { World } from "@/classes/World";
import { vec3 } from "gl-matrix";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Engine ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      // WebGL Coontext
      const gl = setupGL(canvas);
      // Initialize input
      const inputManager = new InputManager(canvas);
      // Compile Shaders
      const defaultShaderProgram = new ShaderProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
      );

      // Create the default World
      const world = new World(gl); // TODO -> In the future you will be able to load the world from a file)
      world.addCamera(
        new Camera("perspective")
      );

      // Initialize the Renderer
      const renderer = new Renderer(canvas, gl, inputManager, world);
      renderer.start();
    }
  });

  function setupGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    return gl;
  }

  return (
    <>
      <FpsOverlay />
      <LogOverlay />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            playAudio("/audio/ci-3-91252.mp3");
          }}
        >
          Play Audio
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="h-full w-full"
      ></canvas>
    </>
  );
}
