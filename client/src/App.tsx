import { useEffect, useState } from "react";
import { Post } from "./shared/Post";
import { RenderPages } from "./RenderPages";

import { fs } from "./shared/fs-poly/web";
import { Account } from "./shared/loadData";
import { API, API_HOST } from "./shared/const";

import ReactGA from 'react-ga4';

async function loadPosts() {
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
};

export function App() {
  const [value, setValue] = useState<Post[] | undefined>(undefined);
  
  useEffect(() => {
    ReactGA.initialize('G-YSNQML280F');
    ReactGA.send("pageview");

    loadPosts().then(setValue);
  }, []);

  if (!!value) {
    return <RenderPages posts={value} />
  } else {
    return null;
  }
}