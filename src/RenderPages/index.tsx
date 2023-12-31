import { Fragment } from "react";
import { RenderPosts } from "../RenderPosts";
import { Page } from "../getData";

import style from "./index.module.scss";

interface RenderPagesProps {
  pages: Page[]
}

export function RenderPages({ pages }: RenderPagesProps) {
  return <>{pages.map(p => (
    !!p.posts.length && 
    <Fragment key={p.name}>
      <Profile name={p.name} src={p.profile} />
      <RenderPosts posts={p.posts} />
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