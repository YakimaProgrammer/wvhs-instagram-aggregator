( cd client && npm run build && cd build && scp -r * hp:/var/www/wvhs-instagram.magnusfulton.com ) &
( cd server && npm run build && cd dist && scp -r * hp:/opt/instagram-aggregator ) &

wait
