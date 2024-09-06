use post::Post;
use std::sync::Arc;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct PostsProps {
  pub posts: Arc<Vec<Post>>,
}

/// Displays a collection of `Post`s
#[function_component(Posts)]
pub fn posts(PostsProps { posts }: &PostsProps) -> Html {
  let posts = {
    posts
      .iter()
      .map(|post| {
          html! {<div key={post.time}>{ format!("This post was made by {}. It reads {}", post.profile_name, post.caption) }</div>}
      })
      .collect::<Html>()
  };

  html! {
    <>{posts}</>
  }
}
