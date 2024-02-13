#Build the webclient
( cd client && npm run build && cd build && scp -r * hp:/var/www/wvhs-instagram.magnusfulton.com ) &

#Build the server
( cd server && npm run build && cd dist && scp -r * hp:/opt/instagram-aggregator ) &

wait
