import { Fragment } from "react";
import { RenderPost } from "../RenderPosts";
import { Post } from "../shared/Post";
import style from "./index.module.scss";

interface RenderPagesProps {
  posts: Post[]
}

export function RenderPages({ posts }: RenderPagesProps) {
  return (
    <>
      {posts.map(post => (
        <Fragment key={post.time}>
          <Profile name={post.profile_name} src={post.profile_picture} />
          <RenderPost post={post} />
        </Fragment>
      ))}
    </>
  );
}

interface ProfileProps {
  src: string;
  name: string;
}

function Profile({ name, src }: ProfileProps) {
  return (
    <div className={style.profile}>
      <div className={style.profilepiccontainer}>
        <img src={src} alt="" className={style.profilepic} />
      </div>
      <h1 className={style.profilename}>
        <a href={`https://www.instagram.com/${name}/`} className={style.fakelink}>@{name}</a>
      </h1>
    </div>
  );
}
