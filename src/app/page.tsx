"use client";

import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";
import { InputManager } from "@/engine/InputManager";
import { Renderer } from "@/engine/Renderer";
import { ShaderProgram } from "@/engine/ShaderProgram";
import { useEffect, useRef } from "react";

import { vertexShaderSource } from "../shaders/vertexShader";
import { fragmentShaderSource } from "../shaders/fragmentShader";
import { Log } from "@/utils/Overlays";
import { playAudio } from "@/utils/Audio";
import { Button } from "@mui/material";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Engine ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const gl = setupGL(canvas);
      const inputManager = new InputManager(canvas);
      const defaultShaderProgram = new ShaderProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
      );
      const renderer = new Renderer(canvas, gl, inputManager);
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
