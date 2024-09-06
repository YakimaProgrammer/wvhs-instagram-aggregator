use yew::prelude::*;

/// Displays a loading animation using SVG
#[function_component(Loading)]
pub fn loading() -> Html {
  html! {
    <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="inherit">
      <circle cx="15" cy="15" r="15">
        <animate attributeName="opacity" from="1" to="0.3" dur="0.8s" repeatCount="indefinite" begin="0" />
      </circle>
      <circle cx="60" cy="15" r="15">
        <animate attributeName="opacity" from="1" to="0.3" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate attributeName="opacity" from="1" to="0.3" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
      </circle>
    </svg>
  }
}
