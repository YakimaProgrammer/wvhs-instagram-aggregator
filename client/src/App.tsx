import { useEffect, useState } from "react";
import { Post } from "./shared/Post";
import { RenderPages } from "./RenderPages";
import ReactGA from 'react-ga4';
import { API_ENDPOINT } from "./endpoint";

async function loadPosts(): Promise<Post[]> {
  const response = await fetch(`${API_ENDPOINT}/posts.json`);
  const posts: Post[] = await response.json();
  return posts.slice(0, 20);
}

export function App() {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  
  useEffect(() => {
    ReactGA.initialize('G-YSNQML280F');
    ReactGA.send("pageview");

    loadPosts().then(setPosts);
  }, []);

  if (posts) {
    return <RenderPages posts={posts} />;
  } else {
    return null;
  }
}
