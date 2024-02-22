import { fsPoly } from "./fs";

interface NginxListing {
  name: string;
  type: "directory" | "file";
  mtime: string;
  size?: number;
}

export class fs implements fsPoly {
  //Ideally a url
  base: string;

  constructor(base: string) {
    this.base = base;
  }
  
  async readFile(path: string): Promise<string> { 
    const resp = await fetch(`${this.base}/${path}`);
    return await resp.text();
  }
  
  //Has the potential to really beat a server up
  async readdir(path: string, recursive: boolean): Promise<string[]> {
    return this._readdir(path, recursive, undefined);
  }
  private async _readdir(path: string, recursive: boolean, previousPath?: string): Promise<string[]> {
    const resp = await fetch(`${this.base}/${path}`);
    const listing: NginxListing[] = await resp.json();
    
    const listingAsPath = listing.map(l => `${!!previousPath ? previousPath : ''}${l.name}`);
    
    if (recursive) {
      const dirs = listing.filter(l => l.type === "directory");
      const recListings = await Promise.all(
        dirs.map(d => this._readdir(`${path}/${d.name}`, true, !!previousPath ? `${previousPath}${d.name}/` : `${d.name}/`))
      );
      
      return listingAsPath.concat(recListings.flat());
    } else {
      return listingAsPath;
    }
  }
}