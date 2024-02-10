import argparse, os, logging, shutil, requests
from datetime import datetime
from login import login_user

parser = argparse.ArgumentParser(description="Downloads the stories and posts from one or more Instagram accounts")

parser.add_argument('--username', action='store', help="The username of the puppet account to use for downloading the stories and posts", required=True)
parser.add_argument('--password', action='store', help="The password of the puppet account to use for downloading the stories and posts", required=True)
parser.add_argument('--account', action='store', help="An account (or accounts) to download the stories and posts of", required=True, nargs='+')
parser.add_argument('--verbose', action='store_true', help="Enable verbose logging")
parser.add_argument('--outputdir', default=".", help="Where to write user stories and posts")

args = parser.parse_args()

if args.verbose:
  logging.basicConfig(level=logging.INFO)

FORMAT = "%Y-%m-%d_%H-%M-%S_UTC"

def get_userid(cl, user):
  path = f"{args.outputdir}/{user}/id"

  try:
    with open(path) as f:
      return f.read().strip()
  except FileNotFoundError:
    with open(path, "w") as f:
      id = cl.user_id_from_username(user)
      f.write(id)
      return id

def get_story(cl, story):
  username = story.user.username
  pk = story.pk
  filename = story.taken_at.strftime(FORMAT)

  media_folder = f"{args.outputdir}/{username}"
  json_meta = f"{media_folder}/{filename}.json"

  try:
    with open(json_meta, "x") as j:
      j.write(story.model_dump_json())
      cl.story_download(pk, filename, media_folder)

  except FileExistsError:
    pass #do nothing

def get_posts(cl, uid):
  cursor = None
  while True:
    posts, cursor = cl.user_medias_paginated(uid, 5, cursor)

    if not cursor:
      #cl.user_medias_paginated sometimes breaks on private accounts. 
      #I believe that [https://github.com/instaloader/instaloader] is able
      #to handle private accounts.
      logging.warning(f"Unable to get posts! Is this a private account?")
      return

    for post in posts:
      username = post.user.username
      pk = post.pk
      filename = post.taken_at.strftime(FORMAT)

      media_folder = f"{args.outputdir}/{username}"
      json_meta = f"{media_folder}/{filename}.json"
      caption = f"{media_folder}/{filename}.txt"

      try:
        with open(json_meta, "x") as j, open(caption, "x") as c:
          j.write(post.model_dump_json())
          c.write(post.caption_text)
          
          if post.resources:
            for i, resource in enumerate(post.resources):
              get_post(cl, resource, f"{filename}_{i}", media_folder)
          else:
            get_post(cl, post, filename, media_folder)
          
      except FileExistsError:
        return

def get_post(cl, post, filename, folder):
  #{photo,video}_download force a filename. If I go a level level lower, I can set my own filename.
  if post.media_type == 1:
    cl.photo_download_by_url(post.thumbnail_url, filename, folder)
  else:
    cl.video_download_by_url(post.video_url, filename, folder)

def get_profile_picture(cl, uid): 
  user = cl.user_info(uid)
  url = str(user.profile_pic_url_hd or user.profile_pic_url)
  response = requests.get(url, stream=True)
  with open(f"{args.outputdir}/{user.username}/{datetime.now().strftime(FORMAT)}_profile_pic.jpg", "wb") as f:
    response.raw.decode_content = True
    shutil.copyfileobj(response.raw, f)

def main():
  cl = login_user(args.username, args.password)
  cl.delay_range = [1, 3]

  #Ensure that the output dirs exist
  for user in args.account:
    try:
      os.mkdir(f"{args.outputdir}/{user}")
    except FileExistsError:
      pass

  logging.info("Getting user ids...")
  ids = [get_userid(cl, user) for user in args.account]

  for uid, username in zip(ids, args.account):
    logging.info(f"Getting stories for {username}...")
    for story in cl.user_stories(uid, 10):
      get_story(cl, story)

    logging.info(f"Getting posts for {username}...")
    get_posts(cl, uid)

    logging.info(f"Getting the profile picture for {username}...")
    get_profile_picture(cl, uid)
  
if __name__ == "__main__":
  main()