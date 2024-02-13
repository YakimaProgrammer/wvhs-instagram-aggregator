
# Welcome to wvhs-instagram-aggregator!

West Valley High School uses social media, primarily Instagram, to keep students informed about what's going on. Unfortunately, not everyone at WVHS has Instagram (or is even allowed to have it), so I wrote this aggregator tool. Here's a guide to what each part of this tool is, and how to set something like this up again in the future (...or fix it when everything inevitably breaks).   
# Project Organization
This tool is made of four components:
1. **The Webclient** - [the webpage](https://wvhs-instagram.magnusfulton.com/) responsible for actually showing the Instagram posts to students. This code is stored in `client/`.
2. **The API** - [the API](https://api.magnusfulton.com/instagram/api) responsible for sorting through the database of downloaded posts and returning them in a format that is meaningful to the webclient. This code is stored in `server/`.
3. **The Downloader** - the program responsible for downloading the Instagram posts every morning. I'm using [`instaloader`](https://github.com/instaloader/instaloader).
4. **The Server** - the HTTP software responsible for actually serving content to students. I'm using [nginx](https://nginx.org/en/).

# Setup
These instructions assume you are on a Debian-based system. I'd recommend cloning this repository to somewhere sane on whatever device you're developing on. 
```bash 
$ git clone https://github.com/YakimaProgrammer/wvhs-instagram-aggregator.git
$ cd wvhs-instagram-aggregator
```
## The Webclient
The webclient is written in React+TypeScript and uses [`create-react-app`](https://create-react-app.dev/). I'm using node v18.17.1 on my machine for development. Here's how to install node if you don't already have it:
```bash
#Check node version
$ node --version
#If you get "node: command not found" or are having issues compiling the webclient, install node
$ cd /opt
$ sudo wget https://nodejs.org/download/release/v18.17.1/node-v18.17.1-linux-x64.tar.xz
$ sudo tar -xf node-v18.17.1-linux-x64.tar.xz
$ cd /usr/local/sbin
$ sudo ln -s /opt/node-v18.17.1-linux-x64/bin/* .
#Test if node is installed
$ cd ~
$ node --version # should be v18.17.1
```
Now that node is installed, `cd` to wherever you `git clone`'d this repository.  
Now let's build the webclient!
```bash
$ cd client/
$ npm i 
$ npm start
```
A webbrowser should have just opened to [`http://localhost:3001/`](http://localhost:3001/). Depending on the state of my own server at [`https://api.magnusfulton.com/instagram/api`](https://api.magnusfulton.com/instagram/api), you'll either see something resembling an Instagram feed or a wall of red text that reads:
```
Uncaught runtime errors:
ERROR
NetworkError when attempting to fetch resource.
```
This error means that either [`https://api.magnusfulton.com/instagram/`](https://api.magnusfulton.com/instagram/) is offline (pretty likely), or you are not connected to the internet.

## The API
The client is able to get posts in one of two ways:
1. The [`https://api.magnusfulton.com/instagram/api`](https://api.magnusfulton.com/instagram/api) server, which builds and serves a bundle of posts directly to the client.
2. Manually browsing the files at [`https://api.magnusfulton.com/instagram/`](https://api.magnusfulton.com/instagram/) (notice the `/instagram/` instead of `/instagram/api`) to build this bundle itself. This is considerably slower because of network overhead.  

The server is built using express.js and TypeScript. Here's how to build it:
```bash
#If you are still in client/
$ cd ..
$ cd server/
$ npm i
$ npm run build
```
You'll (hopefully) see something that looks like this:
```bash
> wvhs-instagram-server@1.0.0 build
> npx tsc
```
... and then the shell will exit, signifying everything compiled successfully.
## The Downloader
I'm using  [`instaloader`](https://github.com/instaloader/instaloader) to grab posts from Instagram because it's able to consistently download posts without getting blocked. I tried to use it for stories too, but I ran into some authentication issues at the time. If you're curious, I wrote my own downloader (commit dd9779f58ee8d0efd0dc63bff498f9cc349717d5), which used [`instagrapi`](https://github.com/subzeroid/instagrapi) to download posts and stories. While this fixed the authentication issues and downloaded stories, this downloader never worked for long because the puppet accounts it used would be disabled by Instagram's anti-bot measures.  
At the time of writing, `instaloader` is written in Python and is compatible with Python versions 3.8, 3.9, 3.10, and 3.11. Here's how to install Python if you need it:
```bash
#Python 3.10 is supplied by this PPA if it isn't already a part of your distro's repository
$ sudo add-apt-repository ppa:deadsnakes/ppa -y
#I recommend doing this, although most distros do this automatically for you after adding a PPA. 
$ sudo apt-get update
#Install Python
$ sudo apt-get install python3.10 -y
```
## The Server
Here's how to get everything deployed. If you already have a server set up, you can skip to "Deploying".

### Set up a server that will host everything
Unless you already have a server set up, or an old computer laying around, I recommend hosting out of a Raspberry Pi. Here's [a guide for setting up a Raspberry Pi](https://www.raspberrypi.com/documentation/computers/getting-started.html).

### Set up port forwarding
Unfortunately, every router is a little bit different for setting up port forwarding. Here's a [great guide that can help](https://portforward.com/), though. On your server, run `$ python3 -m http.server` and make sure that the port is forwarded through your router (Python's `http.server` defaults to port 8000). On your phone, first go to a site like [`https://whatismyipaddress.com/`](https://whatismyipaddress.com/), mark the IP addresses down, then disconnect from WiFi, and go to `http://<whatever the IPv4 address was>:8000/`. If you see anything, congratulations! Your server is accessible. If not - and you followed the port forwarding guide - there is a strong chance your ISP uses carrier-grade network address translation. This means that it is impossible to set up port forwarding out of your house. 

### Register a domain name
If you are able to port forward, I recommend setting up an account with [Namecheap](https://www.namecheap.com/) and registering a domain of your choosing. A `.com` domain will usually cost around $15 a year. Once you've paid for your domain, go to `Domain List` > click `Manage` next to your domain > `Advanced DNS` > `⊕ Add New Record`.
Click `A` record and copy whatever the IPv4 address was that you got out of [`https://whatismyipaddress.com/`](https://whatismyipaddress.com/) to the `IP Address` field. If you have IPv6, add a `AAAA` record with that address as well. For the first `A`/`AAAA` pair, I recommend setting the `Host` field to `@`. Put the same information in again, but using `api` as the `Host` for another pair.

### Set up nginx
Here's how to install and set up nginx on your server:
```bash
$ sudo apt install nginx
$ cd /etc/nginx/conf.d/
$ sudo nano aggregator.conf
$ sudo mkdir -p /var/www/instagram-aggregator/instagram/
$ sudo chown -R $(whoami): /var/www/instagram-aggregator/
$ sudo mkdir /var/www/webclient/
$ sudo chown -R $(whoami): /var/www/webclient/
```
Paste this into `aggregator.conf`:
```nginx 
server {
  listen 80;
  listen [::]:80;
  server_name <whatever the domain you registered was>;
  root /var/www/webclient/;
}

server {
  listen 80;
  listen [::]:80;
  server_name api.<whatever the domain you registered was>;
  root /var/www/instagram-aggregator/;
  
  add_header Access-Control-Allow-Origin "https://<yourdomain>.com" always;
  
  location /instagram {
    autoindex on;
    autoindex_format json;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 2048;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  }
  location /instagram/api {
    proxy_pass http://localhost:3000/instagram/api;
  }
}
```
And run:
```bash
$ sudo systemctl reload nginx
```
After forwarding ports 80 and 443, you should now be able to access `http://<yourdomain>/`, but not `https://<yourdomain>/`.

### Adding HTTPS
Follow [these instructions for installing `certbot`](https://certbot.eff.org/). Then, on your server, run this command:
```bash
$ sudo certbot --nginx -d <yourdomain> -d <yourdomain>
$ sudo systemctl reload nginx
```
You should now be able to access `https://<yourdomain>/`.

### Deploying
On the computer you `git cloned`'d this repository on, make the following changes:
1. Edit some files

In `deploy.sh`, make the following changes:
```bash
#Build the webclient
( cd client && npm run build && cd build && scp -r * <remote username>@<server address>:/var/www/webclient ) &

#Build the server
( cd server && npm run build && cd dist && scp -r * <remote username>@<server address>:/opt/instagram-aggregator ) &

wait
```
Change this line in `client/src/App.tsx` from
```TypeScript
let API = "https://api.magnusfulton.com/instagram/";
```
to
```TypeScript
let API = "https://api.<your domain>/instagram/";
```
Next, change this line in `server/src/index.ts` from 
```TypeScript
const account = new Account(new fs(base), "https://api.magnusfulton.com/instagram/");
```
to 
``` TypeScript
const account = new Account(new fs(base), "https://api.<your domain>/instagram/");
```
2. Make some folders on the server
```bash
$ sudo mkdir /opt/instagram-aggregator
$ sudo chown $(whoami): /opt/instagram-aggregator
$ sudo mkdir /opt/instaloader
$ sudo chown $(whoami): /opt/instaloader
```
3. Set up `Python` and `node` on your server the same way you set it up on the computer where you `git cloned`'d this repository.
4.  Set up `server/` and `instaloader/` on the server.

On the computer where you `git cloned`'d this repository:
```bash
$ scp server/package.json <remote username>@<server address>:/opt/instagram-aggregator
```
On the server:
```bash
$ cd /opt/instagram-aggregator
$ npm i
$ cd ..
$ git clone https://github.com/instaloader/instaloader.git /opt/instaloader/
```

5. Run `$ ./deploy.sh` on the computer where you `git cloned`'d this repository.
6. Modify your `crontab`

On your server, run `$ crontab -e`
Add this line to automatically update the Instagram post database every day at 9am:
```
0 9 * * * cd /var/www/instagram-aggregator/ && python3 /opt/instaloader/instaloader.py --fast-update <a space seperated list of accounts to download> > /dev/null
```
... and then manually run that command right now to build the database:
`$ cd /var/www/instagram-aggregator/ && python3 /opt/instaloader/instaloader.py --fast-update <a space seperated list of accounts to download>`

### Celebrate!

`https://<your domain>/` should now show an Instagram-like timeline of posts from the accounts you specified!

