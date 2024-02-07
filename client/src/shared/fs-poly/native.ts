import { fsPoly } from "./fs";
import * as fsNative from "fs/promises";

export class fs implements fsPoly {
  //Ideally an absolute path
  base: string;

  constructor(base: string) {
    this.base = base;
  }

  async readdir(path: string, recursive: boolean) { 
    return await fsNative.readdir(`${this.base}/${path}`, { recursive });
  }

  async readFile(path: string) {
    return await fsNative.readFile(`${this.base}/${path}`, { encoding: "utf-8"});
  }

}
