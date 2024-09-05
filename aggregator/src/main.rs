use aggregator::parse_directory;
use clap::Parser;
use post::Post;
use serde_json::to_writer;
use std::fs;
use std::fs::File;
use std::io::BufWriter;

#[derive(Parser)]
#[command(
  version,
  about = "A CLI tool to consolidate a directory of posts into a manifest file"
)]
pub struct Args {
  /// Which directory to consolidate
  #[arg(short, long, default_value_t = String::from("."))]
  pub directory: String,

  /// Where to write the output file
  #[arg(short, long, default_value_t = String::from("."))]
  pub output_file: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
  let args = Args::parse();

  let mut posts: Vec<Post> = Vec::new();
  for entry in fs::read_dir(args.directory)? {
    let path = entry?.path();
    if path.is_dir() {
      posts.append(&mut parse_directory(path).expect("the directory to parse correctly"));
    }
  }

  posts.sort();
  posts.reverse();

  let file = File::create(args.output_file)?;
  let writer = BufWriter::new(file);

  // Serialize the Vec and write it to the file
  to_writer(writer, &posts)?;

  Ok(())
}
