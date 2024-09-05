use chrono::NaiveDateTime;
use lazy_static::lazy_static;
use post::Post;
use regex::Regex;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

lazy_static! {
  static ref DATE_REGEX: Regex = Regex::new(r"\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}").unwrap();
}

pub fn parse_directory<P: AsRef<Path>>(path: P) -> Option<Vec<Post>> {
  let profile_name = path.as_ref().file_name()?.to_str()?;
  let profile_picture = get_latest_profile_picture(&path)?;
  let mut captions = get_captions(&path)?;
  let media = group_media(&path)?;
  let mut posts: Vec<Post> = Vec::new();

  for (time, mut srcs) in media.into_iter() {
    srcs.sort(); // ensures that the order on the site matches instagram

    posts.push(Post {
      srcs,
      caption: captions.remove(&time).unwrap_or_else(String::new),
      time,
      profile_name: profile_name.to_string(),
      profile_picture: profile_picture.clone(),
    });
  }

  posts.sort();
  posts.reverse();

  Some(posts)
}

pub fn get_captions<P: AsRef<Path>>(path: P) -> Option<HashMap<i64, String>> {
  let paths = fs::read_dir(path).ok()?;
  let mut map: HashMap<i64, String> = HashMap::new();

  for path in paths {
    let path = path.ok()?.path();
    let ext = path.extension().and_then(|s| s.to_str());
    let filename = path.file_name()?.to_str()?;

    if ext == Some("txt") {
      map.insert(to_unix_timestamp(filename)?, fs::read_to_string(path).ok()?);
    }
  }

  Some(map)
}

pub fn group_media<P: AsRef<Path>>(path: P) -> Option<HashMap<i64, Vec<String>>> {
  let paths = fs::read_dir(path).ok()?;
  let mut map: HashMap<i64, Vec<String>> = HashMap::new();

  for path in paths {
    let path = path.ok()?.path();
    let ext = path.extension().and_then(|s| s.to_str());
    let path = path.file_name()?.to_str()?;

    if ext == Some("jpg") || ext == Some("mp4") {
      map
        .entry(to_unix_timestamp(path)?)
        .or_insert_with(Vec::new)
        .push(path.to_string());
    }
  }

  Some(map)
}

pub fn get_latest_profile_picture<P: AsRef<Path>>(path: P) -> Option<String> {
  let paths = fs::read_dir(path).ok()?;
  let mut pics: Vec<String> = paths
    .filter_map(Result::ok)
    .filter_map(|entry| entry.file_name().into_string().ok())
    .filter(|s| s.contains("profile_pic"))
    .collect();

  pics.sort_by_key(|filename| to_unix_timestamp(filename).unwrap_or(i64::MIN));

  pics.pop()
}

pub fn match_date(date_str: &str) -> Option<String> {
  if let Some(date_matches) = DATE_REGEX.captures(date_str) {
    //date_matches[0] is guaranteed
    Some(date_matches[0].to_string())
  } else {
    None
  }
}

pub fn to_unix_timestamp(date_str: &str) -> Option<i64> {
  if let Some(date) = match_date(date_str) {
    NaiveDateTime::parse_from_str(&date, "%Y-%m-%d_%H-%M-%S")
      .map(|d| d.and_utc().timestamp())
      .ok()
  } else {
    None
  }
}
