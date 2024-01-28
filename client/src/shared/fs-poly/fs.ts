export interface fsPoly {
  readdir: (path: string, recursive: boolean) => Promise<string[]>;
  readFile: (path: string) => Promise<string>
}