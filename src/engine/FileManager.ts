import { IFileManager } from "@/interfaces/EngineInterfaces";
import { promises as fs } from "fs";

export class FileManager implements IFileManager {
  async readTXT(path: string): Promise<string> {
    return fs.readFile(path, { encoding: "utf-8" });
  }
  async readGLSL(path: string): Promise<string> {
    return fs.readFile(path, { encoding: "utf-8" });
  }
  async readFBX(path: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async readOBJ(path: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async writeFile(path: string, str: string): Promise<void> {
    fs.writeFile(path, str);
  }
}
