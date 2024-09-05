#[cfg(test)]
mod test_timestamp {
  use aggregator::to_unix_timestamp;

  #[test]
  fn test_compliant_strings() {
    assert_eq!(to_unix_timestamp("2024-09-05_16-30-06"), Some(1725553806));
    assert_eq!(to_unix_timestamp("2022-10-07_08-15-32"), Some(1665130532));
  }

  #[test]
  fn test_noncompliant_strings() {
    assert_eq!(to_unix_timestamp("2024-09-05"), None);
    assert_eq!(to_unix_timestamp("12-30-45"), None);
    assert_eq!(to_unix_timestamp("2024-09-05_12:30:45"), None);
    assert_eq!(to_unix_timestamp("random_string"), None);
  }

  #[test]
  fn test_compliant_paths() {
    assert_eq!(
      to_unix_timestamp("testdata/2024-05-21_22-23-52_UTC_profile_pic.jpg"),
      Some(1716330232)
    );
  }
}
