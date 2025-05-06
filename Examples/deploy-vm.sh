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
ssh $server ". ~/.nvm/nvm.sh; cd ${appRoot}; node -v; npm i --loglevel verbose --no-audit"
ssh $server "cd ${appRoot}; rm -rf build"
echo "Creating archive..."
tar -czvf build.tar.gz ./build
echo "Archive has been created."
scp -r build.tar.gz $server:$appRoot
ssh $server "tar -xzvf ${appRoot}/build.tar.gz -C ${appRoot}"
echo "Build files have been copied to the server."
ssh $server "rm ${appRoot}/build.tar.gz"
rm build.tar.gz
ssh $server ". ~/.nvm/nvm.sh; cd ${appRoot}; PORT=${appPort} pm2 start build/server.js --name ${appName}"
echo "Here we output last 1000 lines of pm2 error log in case the app does not start"
ssh $server "tail -n 1000 .pm2/logs/${appName}-error.log"
