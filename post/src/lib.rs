use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Post {
  pub srcs: Vec<String>,
  pub caption: String,
  pub time: u64,
  pub profile_name: String,
  pub profile_picture: String,
}
