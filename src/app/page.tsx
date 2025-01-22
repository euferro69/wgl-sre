"use client";

import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";
import { Renderer } from "@/engine/Renderer";
import { WebGLCanvas } from "@/engine/WebGLCanvas";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const webglCanvas = new WebGLCanvas(canvas);
      const renderer = new Renderer(webglCanvas);

      renderer.start()
    }
  });

  return (
    <>
      <FpsOverlay />
      <LogOverlay />
      <canvas ref={canvasRef} id="webgl-canvas" className="h-full w-full"></canvas>
    </>
  );
}
