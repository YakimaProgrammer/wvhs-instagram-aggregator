import { useEffect, useState } from "react";
import { Post } from "./shared/Post";
import { RenderPages } from "./RenderPages";

import { fs } from "./shared/fs-poly/web";
import { Account } from "./shared/loadData";

import ReactGA from 'react-ga4';

let API = "https://api.magnusfulton.com/instagram/";

let API_HOST = `${API}api`;
if (process.env.NODE_ENV === "development") API_HOST = "http://localhost:3000/instagram/api";

const promise = (async () => {
  try {
    //The API server is faster, but might be crashed
    const resp = await fetch(API_HOST);
    const posts: Post[] = await resp.json();
    return posts;
  } catch {
    //The client is slower, but more resilient
    const account = new Account(new fs(API), API);
    return await account.getPosts();
  }
})();

export function App() {
  const [value, setValue] = useState<Post[] | undefined>(undefined);
  const [resolved, setResolved] = useState(false);
  
  useEffect(() => {
    ReactGA.initialize('G-YSNQML280F');
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    promise.then(setValue);
    setResolved(true);
  }, []);

  if (resolved && !!value) {
    return <RenderPages posts={value} />
  } else {
    return null;
  }
}