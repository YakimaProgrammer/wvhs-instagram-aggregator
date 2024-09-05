#[cfg(test)]
mod test_group_media {
  use aggregator::group_media;

  #[test]
  fn test_group_media() {
    let mut map = group_media("testdata").expect("to parse the testdata directory successfully");
    let mut srcs = map
      .remove(&1717635698)
      .expect("to have a key for the media");
    srcs.sort();

    assert_eq!(
      srcs,
      vec![
        String::from("2024-06-06_01-01-38_UTC.jpg"),
        String::from("2024-06-06_01-01-38_UTC_1.jpg"),
        String::from("2024-06-06_01-01-38_UTC_2.jpg"),
        String::from("2024-06-06_01-01-38_UTC_3.jpg")
      ]
    );
  }
}
