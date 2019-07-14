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
in front-mjail folder:
$ yarn install
$ yarn ng serve

front will be accessible on http://localhost:4200 and will use backend on http://localhost:8080
