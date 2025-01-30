"use server";

import { FileManager } from "@/engine/FileManager";
import ClientHome from "./client";

export default async function Home() {
  const fileManager = new FileManager();

  // Manual loading of shaders for now
  const vs_path = "./src/shaders/vertexShaders/VS_Default.glsl";
  const fs_path = "./src/shaders/fragmentShaders/FS_Flat.glsl";
  const vertexShaderSource = await fileManager.readGLSL(vs_path);
  const fragmentShaderSource = await fileManager.readGLSL(fs_path);

  // console.log("SHADERS:", "\n", vertexShaderSource, "\n", fragmentShaderSource);

  return (
    <>
      <ClientHome
        vertexShaderSource={vertexShaderSource}
        fragmentShaderSource={fragmentShaderSource}
        vsPath={vs_path}
        fsPath={fs_path}
      />
    </>
  );
}
