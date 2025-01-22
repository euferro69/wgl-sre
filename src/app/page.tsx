"use client";

import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";
import { InputManager } from "@/engine/InputManager";
import { Renderer } from "@/engine/Renderer";
import { ShaderProgram } from "@/engine/ShaderProgram";
import { useEffect, useRef } from "react";

import { vertexShaderSource } from "../shaders/vertexShader";
import { fragmentShaderSource } from "../shaders/fragmentShader";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function setupGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    return gl;
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const gl = setupGL(canvas);
      // Engine
      const inputManager = new InputManager(canvas);
      const shaderProgram = new ShaderProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
      );
      const renderer = new Renderer(canvas, gl, inputManager);
      renderer.start();
    }
  });

  return (
    <>
      <FpsOverlay />
      <LogOverlay />

      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="h-full w-full"
      ></canvas>
    </>
  );
}
