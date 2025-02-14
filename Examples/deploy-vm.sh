#!/bin/bash
echo "Start staging deploy"
server=$1
appRoot=$2
appPort=$3
appName=$4
branch=$5
echo "server ${server}"
echo "appRoot ${appRoot}"
echo "appPort ${appPort}"
echo "appName ${appName}"
echo "branch ${branch}"
ssh $server ". ~/.nvm/nvm.sh; pm2 stop ${appName}; pm2 delete ${appName}"
ssh $server "cd ${appRoot} && git checkout ${branch} && git reset --hard && git pull"
ssh $server ". ~/.nvm/nvm.sh; cd ${appRoot}; rm package-lock.json; node -v; npm i --loglevel verbose --no-audit; NOINDEX=1 npm run build"
ssh $server ". ~/.nvm/nvm.sh; cd ${appRoot}; PORT=${appPort} pm2 start build/server.js --name ${appName}"
