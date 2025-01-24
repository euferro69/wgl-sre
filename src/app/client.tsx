"use client";

import { useEffect, useRef, useState } from "react";
import FpsOverlay from "@/components/FpsOverlay";
import LogOverlay from "@/components/LogOverlay";
import LoadingPopup from "@/components/LoadingPopup";
// Engine
import { InputManager } from "@/engine/InputManager";
import { Renderer } from "@/engine/Renderer";
import { ShaderProgram } from "@/engine/ShaderProgram";
import { Camera } from "@/classes/Camera";
import { World } from "@/classes/World";
import EngineConsole from "@/components/EngineConsole";
import EngineHeader from "@/components/EngineHeader";
import { StaticMesh } from "@/classes/StaticMesh";
import {
  cubeVertexData_colored,
  cubeVertexData_white,
} from "@/assets/cube_model";
import DirectionalLight from "@/classes/DirectionalLight";

interface ClientHomeProps {
  vertexShaderSource: string;
  fragmentShaderSource: string;
}

export default function ClientHome({
  vertexShaderSource,
  fragmentShaderSource,
}: ClientHomeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  // INIT ENGINE ----------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      // WebGL Coontext
      const gl = setupGL(canvas);

      // Initialize input
      setTimeout(() => {
        setLoadingMessage("Init Input Manager");
      }, 150);
      const inputManager = new InputManager(canvas);

      // Compile Shaders
      setTimeout(() => {
        setLoadingMessage("Compiling Shaders...");
      }, 400);
      const defaultShaderProgram = new ShaderProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
      );

      // Static Mesh (Cube)
      const cube = new StaticMesh(
        gl,
        cubeVertexData_white,
        [
          {
            name: "a_position",
            size: 3, // 3 floats for x, y, z
            type: gl.FLOAT,
            normalized: false,
            stride: 6 * Float32Array.BYTES_PER_ELEMENT, // Total bytes per vertex (position + color)
            offset: 0, // Start at the beginning of each vertex
          },
          {
            name: "a_color",
            size: 3, // 3 floats for r, g, b
            type: gl.FLOAT,
            normalized: false,
            stride: 6 * Float32Array.BYTES_PER_ELEMENT, // Total bytes per vertex
            offset: 3 * Float32Array.BYTES_PER_ELEMENT, // Start after position (3 floats)
          },
        ],
        36,
        defaultShaderProgram
      );

      // Cameras
      const camera1 = new Camera("perspective");
      const camera2 = new Camera("perspective", [0, 5, 2]);

      // Create the default World
      setTimeout(() => {
        setLoadingMessage("Loading World...");
      }, 650);
      const world = new World(gl, defaultShaderProgram, canvas); // TODO -> In the future you will be able to load the world from a file)
      world.addCamera(camera1);
      world.addCamera(camera2);
      world.setGridSize(50);
      world.setGridDefaultColor([0.15, 0.15, 0.15, 1.0]);
      world.createGrid();
      world.addStaticMesh(cube);
      // world.setDirectionalLight(new DirectionalLight([0.0, 1.0, 1.0]));
      world.logWorldState();

      // Initialize the Renderer
      const renderer = new Renderer(canvas, gl, inputManager, world);
      renderer.start();

      // Stop loading anim
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

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
      <EngineHeader />

      <FpsOverlay />
      <LogOverlay />

      <LoadingPopup isLoading={isLoading} message={loadingMessage} />

      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="h-full w-full"
      ></canvas>

      <EngineConsole />
    </>
  );
}
