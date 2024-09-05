#[cfg(test)]
mod test_profile_picture {
  use aggregator::get_latest_profile_picture;

  #[test]
  fn gets_latest_profile_picture() {
    assert_eq!(
      get_latest_profile_picture("testdata/"),
      Some(String::from("2024-05-22_22-23-52_UTC_profile_pic.jpg"))
    );
  }
}
