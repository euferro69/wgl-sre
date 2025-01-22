"use client";

import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";
import { InputManager } from "@/engine/InputManager";
import { Renderer } from "@/engine/Renderer";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const inputManager = new InputManager(canvas);
      const renderer = new Renderer(canvas, inputManager);
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
