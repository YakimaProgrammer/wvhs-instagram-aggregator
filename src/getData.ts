import instagram from "./resources/instagram.svg";

interface Listing {
  name: string;
  type: "file" | "directory";
  mtime: string;
}

export interface Post {
  srcs: string[];
  caption: string;
  time: Date;
}

export interface Page {
  posts: Post[];
  name: string;
  profile: string;
}

const TODAY_UTC = new Date(Date.now());
const LAST_WEEK = Date.UTC(
  TODAY_UTC.getUTCFullYear(),
  TODAY_UTC.getUTCMonth(),
  TODAY_UTC.getUTCDate() - 7
);

const ROOT = "https://api.magnusfulton.com/instagram/";

const FILTER =
  /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})_UTC(?:_\d+)?\.(?:txt|jpg|mp4)/;

function groupBy<T, K extends keyof any>(
  array: T[],
  keyFunc: (t: T) => K
): Record<K, T[]> {
  return array.reduce((result, currentValue) => {
    const key = keyFunc(currentValue);
    (result[key] = result[key] || []).push(currentValue);
    return result;
  }, {} as Record<K, T[]>);
}

export async function getData(): Promise<Page[]> {
  const resp = await fetch(ROOT);
  const listing: Listing[] = await resp.json();
  return await Promise.all(
    listing
      .filter((l) => l.type === "directory")
      .map((l) => parseDirectory(l.name))
  );
}

async function parseDirectory(dir: string): Promise<Page> {
  const resp = await fetch(`${ROOT}${dir}/`);
  const listing: Listing[] = await resp.json();

  const allMatches = groupBy(
    listing.filter((v) => FILTER.test(v.name)),
    (l) => {
      const m = l.name.match(FILTER);
      if (!!m) {
        return Date.UTC(
          parseInt(m[1]),
          parseInt(m[2]) - 1, //month is zero indexed
          parseInt(m[3]),
          parseInt(m[4]),
          parseInt(m[5]),
          parseInt(m[6])
        );
      } else {
        return -1;
      }
    }
  );

  const matches = Object.entries(allMatches)
    .map(([t, l]): [number, Listing[]] => [parseInt(t), l])
    .filter(([t, ]) => t > LAST_WEEK)
    .sort(([t1, ], [t2, ]) => t2 - t1); //sort biggest first

  let profile = instagram;
  const pic = listing.filter((l) => l.name.includes("profile_pic")).at(-1);
  if (!!pic) {
    profile = `${ROOT}${dir}/${pic.name}`;
  }

  return {
    name: dir,
    posts: await Promise.all(
      matches.map(([time, listing]) => parsePost(dir, time, listing))
    ),
    profile
  };
}

async function parsePost(
  dir: string,
  time: number,
  listing: Listing[]
): Promise<Post> {
  const captionURL = listing.find((l) => l.name.endsWith("txt"))?.name;
  let caption = "";
  if (!!captionURL) {
    const resp = await fetch(`${ROOT}${dir}/${captionURL}`);
    caption = await resp.text();
  }

  const srcs = listing
    .filter((l) => !l.name.endsWith("txt"))
    .map((l) => `${ROOT}${dir}/${l.name}`);

  return { caption, srcs, time: new Date(time) };
}
