#[cfg(test)]
mod test_group_media {
  use aggregator::parse_directory;
  use post::Post;

  #[test]
  fn test_parse_directory() {
    let posts = parse_directory("testdata").expect("to parse the testdata directory successfully");

    let parsed_posts = vec![
      Post {
        srcs: vec!["2024-07-01_22-26-34_UTC.jpg".to_string()],
        caption: "".to_string(),
        time: 1719872794,
        profile_name: "testdata".to_string(),
        profile_picture: "2024-05-22_22-23-52_UTC_profile_pic.jpg".to_string(),
      },
      Post {
        srcs: vec!["2024-06-28_02-19-47_UTC_1.jpg".to_string()],
        caption: "".to_string(),
        time: 1719541187,
        profile_name: "testdata".to_string(),
        profile_picture: "2024-05-22_22-23-52_UTC_profile_pic.jpg".to_string(),
      },
      Post {
        srcs: vec![
          "2024-06-06_01-01-38_UTC.jpg".to_string(),
          "2024-06-06_01-01-38_UTC_1.jpg".to_string(),
          "2024-06-06_01-01-38_UTC_2.jpg".to_string(),
          "2024-06-06_01-01-38_UTC_3.jpg".to_string(),
        ],
        caption: "A sample caption\n".to_string(),
        time: 1717635698,
        profile_name: "testdata".to_string(),
        profile_picture: "2024-05-22_22-23-52_UTC_profile_pic.jpg".to_string(),
      },
      Post {
        srcs: vec!["2024-05-22_22-23-52_UTC_profile_pic.jpg".to_string()],
        caption: "".to_string(),
        time: 1716416632,
        profile_name: "testdata".to_string(),
        profile_picture: "2024-05-22_22-23-52_UTC_profile_pic.jpg".to_string(),
      },
      Post {
        srcs: vec!["2024-05-21_22-23-52_UTC_profile_pic.jpg".to_string()],
        caption: "".to_string(),
        time: 1716330232,
        profile_name: "testdata".to_string(),
        profile_picture: "2024-05-22_22-23-52_UTC_profile_pic.jpg".to_string(),
      },
    ];

    assert_eq!(posts, parsed_posts);
  }
}
