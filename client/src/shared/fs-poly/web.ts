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
  //Could use a lock or something, but for my case, I don't need that.
  async readdir(path: string, recursive: boolean): Promise<string[]> {
    return (await this.int_readdir(path, recursive)).map(p => canonicalize(path, p));
  }
  private async int_readdir(path: string, recursive: boolean): Promise<string[]> {
    const resp = await fetch(`${this.base}/${path}`);
    const listing: NginxListing[] = await resp.json();
    
    const listingAsPath = listing.map(l => `${path}/${l.name}`);
    
    if (recursive) {
      const dirs = listing.filter(l => l.type === "directory");
      const recListings = await Promise.all(
        dirs.map(d => this.int_readdir(`${path}/${d.name}`, true))
      );
      
      return listingAsPath.concat(recListings.flat());
    } else {
      return listingAsPath;
    }
  }
}

function canonicalize(base: string, path: string): string {
  if (path.startsWith(`${base}/`)) {
    return path.substring(base.length + 1);
  } else {
    return path;
  }
}