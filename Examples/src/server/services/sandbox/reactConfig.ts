import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { SandboxConfig, getSourceFilesForPath } from "./sandboxDependencyUtils";
import { viteProjectFiles, chartBootstrap } from "./viteConfig";

export const getReactSandBoxConfig = async (
    folderPath: string,
    currentExample: TExampleInfo,
    baseUrl: string
): Promise<SandboxConfig> => {
    const files = await getSourceFilesForPath(folderPath, "index.tsx", baseUrl, "App.tsx");
    files["src/main.tsx"] = {
        content: `${chartBootstrap}
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
`,
        isBinary: false,
    };
    files["index.html"] = {
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SciChart React Example</title>
    </head>
    <body style="margin: 0; height: 100vh;">
        <div id="root" style="height: 100%;"></div>
        <script type="module" src="/src/main.tsx"></script>
    </body>
</html>
`,
        isBinary: false,
    };
    return { files: viteProjectFiles(currentExample.path, files, true, currentExample.extraDependencies) };
};
