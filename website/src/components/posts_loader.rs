use crate::components::loading::Loading;
use crate::components::posts::Posts;
use gloo_net::{http::Request, Error};
use post::Post;
use std::sync::Arc;
use yew::prelude::*;

static API_ENDPOINT: &str = include_str!("../.API_ENDPOINT");

/// A component responsible for loading posts
#[function_component(PostsLoader)]
pub fn posts_loader() -> Html {
  let posts: UseStateHandle<Option<Arc<Vec<Post>>>> = use_state(|| Some(Arc::new(vec![])));
  {
    let posts = posts.clone();
    use_effect_with((), move |_| {
      let posts = posts.clone();
      wasm_bindgen_futures::spawn_local(async move {
        // Attempt to fetch the posts
        let result: Result<Vec<Post>, Error> = async {
          let response = Request::get(API_ENDPOINT).send().await?;
          let posts: Vec<Post> = response.json().await?;
          Ok(posts)
        }
        .await;
        posts.set(result.ok().map(|v| Arc::new(v)));
      });
      || ()
    });
  }

  match &*posts {
    Some(vec) => {
      if vec.is_empty() {
        html! {
          <Loading />
        }
      } else {
        html! {
          <Posts posts={vec.clone()} />
        }
      }
    }

    None => {
      html! {
        <h2>{ "Sorry, the server could not be reached. Are you connected to the internet?" }</h2>
      }
    }
  }
}
