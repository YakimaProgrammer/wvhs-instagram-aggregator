import { API_ENDPOINT } from "../endpoint";
import { Post } from "../shared/Post";
import { DateDisplay } from "./DateDisplay";
import { BasicSlideshow } from "./Slideshow";

import style from "./index.module.scss";

interface RenderPostProps {
  post: Post;
}

export function RenderPost({ post }: RenderPostProps) {
  return (
    <div className={style.post}>
      <h2 className={style.date}><DateDisplay date={new Date(post.time * 1_000)} /></h2>
      <PostImages srcs={post.srcs} profile_name={post.profile_name} />
      <p>{post.caption}</p>
    </div>
  )
}

interface PostImagesProps {
  profile_name: string;
  srcs: string[];
}

function PostImages({ srcs, profile_name } : PostImagesProps) {
  if (srcs.length === 0 ) {
    return null;
  } else if (srcs.length === 1) {
    return <RenderPostMedia src={`${API_ENDPOINT}/${profile_name}/${srcs[0]}`} />
  } else {
    return (
      <BasicSlideshow slideChangeDelay={5000}>
        {srcs.map(src => <RenderPostMedia src={`${API_ENDPOINT}/${profile_name}/${src}`} key={src} />)}
      </BasicSlideshow>
    )
  }
}

interface RenderPostMediaProps {
  src: string;
}

function RenderPostMedia({ src }: RenderPostMediaProps) {
  if (src.endsWith("jpg")) {
    return <img src={src} alt="" className={style.media} />
  } else if (src.endsWith("mp4")) {
    return (
      <video controls className={style.media}>
        <source src={src} type="video/mp4" />
      </video>
    );
  } else {
    //Should be impossible. We'll see.
    return null;
  }
}