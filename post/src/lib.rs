use serde::{Deserialize, Serialize};
use std::cmp::Ordering;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct Post {
  pub srcs: Vec<String>,
  pub caption: String,
  pub time: i64,
  pub profile_name: String,
  pub profile_picture: String,
}
impl Ord for Post {
  fn cmp(&self, other: &Self) -> Ordering {
    self.time.cmp(&other.time)
  }
}
impl PartialOrd for Post {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
    Some(self.cmp(other))
  }
}
