import { Fragment } from "react";
import { RenderPost } from "../RenderPosts";
import { Post } from "../shared/Post";

import style from "./index.module.scss";

interface RenderPagesProps {
  posts: Post[]
}

export function RenderPages({ posts }: RenderPagesProps) {
  return <>{posts.map(p => (
    <Fragment key={p.time}>
      <Profile name={p.page.name} src={p.page.profile} />
      <RenderPost post={p} />
    </Fragment>
  ))}</>;
}

interface ProfileProps {
  src: string;
  name: string;
}

function Profile( {name, src}: ProfileProps) {
  return (
    <div className={style.profile}>
      <div className={style.profilepiccontainer}>
        <img src={src} alt="" className={style.profilepic} />
      </div>
      <h1 className={style.profilename}><a href={`https://www.instagram.com/${name}/`} className={style.fakelink}>@{name}</a></h1>
    </div>
  )
}