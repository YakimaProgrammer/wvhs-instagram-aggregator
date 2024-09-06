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
  if posts.is_empty() {
    html! {
      <h2><i>{ "It looks like there aren't any posts right now. Check back later!" }</i></h2>
    }
  } else {
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
}
