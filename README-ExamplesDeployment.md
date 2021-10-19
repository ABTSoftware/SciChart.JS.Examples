# Deploying Examples App to Azure

demo.scichart.com is production hosted on an Azure App Serivce called SciChartJSExamples.  It auto deploys on every checkin to master.  The deploy process gets latest and then runs deploy.sh.  This builds the app in situ (/home/site/repository), then copies the resulting build to /home/site/wwwroot and creates a symlink for node_modules.

To view details of deployment go to Deployment Center, then click Logs.

# If things don't work

Use SSH (under Development Tools in left menu) to access the site, then cd to /home/site/repository/Examples and delete node_modules.

If the Log error mentions failure to find node/npm version, then it may be necessary to update the node and NPM default version settings in Configuration.  After this you also need to clear node_modules as above.

