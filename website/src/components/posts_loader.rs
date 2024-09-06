use crate::components::loading::Loading;
use crate::components::posts::Posts;
use gloo_net::{http::Request, Error};
use post::Post;
use std::rc::Rc;
use yew::prelude::*;

static API_ENDPOINT: &str = include_str!("../.API_ENDPOINT");

/// A component responsible for loading posts
#[function_component(PostsLoader)]
pub fn posts_loader() -> Html {
  let posts: UseStateHandle<Result<Option<Rc<Vec<Post>>>, Error>> = use_state(|| Ok(None));
  {
    let posts = posts.clone();
    use_effect_with((), move |_| {
      let posts = posts.clone();
      wasm_bindgen_futures::spawn_local(async move {
        // Attempt to fetch the posts
        let result: Result<Option<Rc<Vec<Post>>>, Error> = async {
          let response = Request::get(API_ENDPOINT).send().await?;
          let posts: Vec<Post> = response.json().await?;
          Ok(Some(Rc::new(posts)))
        }
        .await;
        posts.set(result);
      });
      || ()
    });
  }

  match &*posts {
    Ok(Some(vec)) => {
      html! {
        <Posts posts={vec.clone()} />
      }
    }
    Ok(None) => {
      html! {
        <Loading />
      }
    }

    Err(_) => {
      html! {
        <h2>{ "Sorry, the server could not be reached. Are you connected to the internet?" }</h2>
      }
    }
  }
}
