import argparse, aiohttp, asyncio, os, logging
from datetime import datetime

parser = argparse.ArgumentParser(description="Downloads the stories from one or more Instagram accounts")

parser.add_argument('--username', action='store', help="The username of the puppet account to use for downloading the stories", required=True)
parser.add_argument('--password', action='store', help="The password of the puppet account to use for downloading the stories", required=True)
parser.add_argument('--account', action='store', help="An account (or accounts) to download the stories of", required=True, nargs='+')
parser.add_argument('--verbose', action='store_true', help="Enable verbose logging")
parser.add_argument('--server', default="http://localhost:8000", help="The base URL of a https://github.com/subzeroid/instagrapi-rest server to use")
parser.add_argument('--outputdir', default=".", help="Where to write user stories")

args = parser.parse_args()

if args.verbose:
  logging.basicConfig(level=logging.INFO)

def flatten(xss):
  return [x for xs in xss for x in xs]

async def get_userid(sess, session_id, username):
  async with sess.post(f"{args.server}/user/id_from_username", data={"sessionid": session_id, "username": username}) as resp:
    return await resp.text()

async def get_stories(sess, session_id, userid):
  async with sess.post(f"{args.server}/story/user_stories", data={"sessionid": session_id, "user_id": userid}) as resp:
    return await resp.json()

#Truely one of the most blocking functions of all time
#Aligns with Instaloader's format for filenames
def map_iso_date_to_filename(isodate):
  dt = datetime.fromisoformat(isodate)
  return dt.strftime("%Y-%m-%d_%H-%M-%S_UTC")

async def download_story(sess, session_id, story_json):
  username = story_json['user']['username']
  pk = story_json['pk']
  #story_json["media_type"] - I'm 90% sure this is only ever {1: jpg, 2: mp4}, but I can't prove it yet, so here we are
  ext = 'jpg' if story_json['video_url'] == None else 'mp4'
  filename = await asyncio.to_thread(map_iso_date_to_filename, story_json["taken_at"])

  try:
    await asyncio.to_thread(os.mkdir, username)
  except FileExistsError:
    #well, I don't need to make a directory, ig
    pass

  #{ returnFile: true } still leaves a copy wherever instagrapi-rest is stored
  async with sess.post(f"{args.server}/story/download", data={"sessionid": session_id, "story_pk": pk, "returnFile": False}) as resp:
    src = await resp.json() #"/some/quoted/path", grumble, grumble
    await asyncio.to_thread(os.rename, src, f"{args.outputdir}/{username}/{filename}.{ext}")

async def main():
  async with aiohttp.ClientSession() as session:
    logging.info("Grabbing the session id...")
    async with session.post(f"{args.server}/auth/login", data={"username": args.username, "password": args.password}) as resp:
      sess_id = await resp.text()

    logging.info("Grabbing a list of user ids...")
    ids = await asyncio.gather(*(get_userid(session, sess_id, user) for user in args.account))

    logging.info("Grabbing a list of stories...")
    story_jsons = flatten(await asyncio.gather(*(get_stories(session, sess_id, id) for id in ids)))

    logging.info("Downloading stories...")
    await asyncio.gather(*(download_story(session, sess_id, story_json) for story_json in story_jsons))

asyncio.run(main())