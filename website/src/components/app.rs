use crate::components::posts_loader::PostsLoader;
use yew::prelude::*;

#[function_component(App)]
pub fn app() -> Html {
  html! {
    <Suspense fallback={html! { <h2>{ "Loading..." }</h2> }}>
      <h1>{ "Hello World" }</h1>
      <PostsLoader />
    </Suspense>
  }
}
