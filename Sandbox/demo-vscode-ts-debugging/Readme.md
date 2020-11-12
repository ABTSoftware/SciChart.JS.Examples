# SciChart.js Demo VS Code TypeScript Debugging

1. Clone the project and do `npm install`
2. Open the project in VSCode
3. Install "Debugger for Chrome" VS Code Extension
4. Add a breakpoint
5. Start the server `npm start`
6. Run the Debugger. Open the debugger tab and run "Launch Chrome"

## You need to have launch.json in place

.vscode/launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```