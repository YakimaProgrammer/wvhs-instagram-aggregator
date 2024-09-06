mod components;

use components::app::App;
use yew::prelude::*;

fn main() {
  yew::Renderer::<App>::new().render();
}
