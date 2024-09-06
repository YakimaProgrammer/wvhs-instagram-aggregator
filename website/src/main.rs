use gloo_net::{http::Request, Error};
use post::Post;
use yew::prelude::*;

static API_ENDPOINT: &str = include_str!(".API_ENDPOINT");

#[function_component(App)]
fn app() -> Html {
  let posts: UseStateHandle<Option<Vec<Post>>> = use_state(|| Some(vec![]));
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
        posts.set(result.ok());
      });
      || ()
    });
  }

  html! {
    <>
      <h1>{ "Hello World" }</h1>
      {
        match &*posts {
          Some(vec) => {
            if vec.is_empty() {
              html! {
                <h2>{ "Nothing yet!" }</h2>
              }
            } else {
              html! {
                <h2>{ "There's posts now!" }</h2>
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
    </>
  }
}

fn main() {
  yew::Renderer::<App>::new().render();
}
