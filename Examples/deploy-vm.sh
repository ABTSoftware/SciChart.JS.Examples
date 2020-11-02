#!/bin/bash
echo "Start production deploy"
server=$1
appRoot=/home/webjsdemoadmin/apps/SciChart.JS.Examples/Examples
ssh $server ". ~/.nvm/nvm.sh; pm2 stop examples; pm2 delete examples"
ssh $server "cd ${appRoot} && git checkout . && git pull"
ssh $server ". ~/.nvm/nvm.sh; cd ${appRoot}; rm package-lock.json; node -v; npm i --loglevel verbose; npm run build"
ssh $server ". ~/.nvm/nvm.sh; cd ${appRoot}; pm2 start build/server.js --name examples"
