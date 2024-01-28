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
      <h2 className={style.date}><DateDisplay date={new Date(post.time)} /></h2>
      <PostImages srcs={post.srcs} />
      <p>{post.caption}</p>
    </div>
  )
}

interface PostImagesProps {
  srcs: string[];
}

function PostImages({srcs} : PostImagesProps) {
  if (srcs.length === 0 ) {
    return null;
  } else if (srcs.length === 1) {
    return <RenderPostMedia src={srcs[0]} />
  } else {
    return (
      <BasicSlideshow slideChangeDelay={5000}>
        {srcs.map(src => <RenderPostMedia src={src} key={src} />)}
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