#!/bin/bash
echo "Start production deploy"
server=webjsdemoadmin@40.71.93.205
appRoot=/home/webjsdemoadmin/apps/SciChart.JS.Examples
ssh $server ". /home/webjsdemoadmin/.nvm/nvm.sh; pm2 stop examples"
