"use server";

import { FileManager } from "@/engine/FileManager";
import ClientHome from "./client";

export default async function Home() {
  const fileManager = new FileManager();

  const vertexShaderSource = await fileManager.readGLSL(
    "./src/shaders/vertexShader.glsl"
  );
  const fragmentShaderSource = await fileManager.readGLSL(
    "./src/shaders/fragmentShader.glsl"
  );

  // console.log("SHADERS:", "\n", vertexShaderSource, "\n", fragmentShaderSource);

  return (
    <>
      <ClientHome
        vertexShaderSource={vertexShaderSource}
        fragmentShaderSource={fragmentShaderSource}
      />
    </>
  );
}
