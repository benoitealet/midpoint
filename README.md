# midpoint
multiple http proxy to help API development and debugging in teams.

Prerequisites:
yarn

Config:
Edit config/config.json

Start:
in root folder:
$ yarn install
$ node midpoint.js

Start front (dev):
in front folder:
$ yarn install
$ yarn build --watch 

front will be accessible via the backend on http://localhost:8080 (or any other value set in config.json)
