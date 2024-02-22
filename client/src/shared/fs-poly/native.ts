import { fsPoly } from "./fs";
import * as fsNative from "fs/promises";

export const fs: fsPoly = {
  readdir: (path: string, recursive: boolean) => fsNative.readdir(path, { recursive }),
  readFile: (path: string) => fsNative.readFile(path, { encoding: "utf-8"})
}
