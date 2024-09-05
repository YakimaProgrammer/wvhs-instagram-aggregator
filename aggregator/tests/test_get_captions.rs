#[cfg(test)]
mod test_get_captions {
  use aggregator::get_captions;

  #[test]
  fn test_get_captions() {
    let mut map = get_captions("testdata").expect("to parse the testdata directory successfully");
    let caption = map
      .remove(&1717635698)
      .expect("to have a key for the caption");

    assert_eq!(caption, String::from("A sample caption\n"));
  }
}
