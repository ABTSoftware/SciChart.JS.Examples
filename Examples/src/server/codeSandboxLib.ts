import * as LZString from "lz-string";

export type ITemplate =
    | "adonis"
    | "vue-cli"
    | "preact-cli"
    | "svelte"
    | "create-react-app-typescript"
    | "create-react-app"
    | "angular-cli"
    | "parcel"
    | "@dojo/cli-create-app"
    | "cxjs"
    | "gatsby"
    | "nuxt"
    | "next"
    | "reason"
    | "apollo"
    | "sapper"
    | "ember"
    | "nest"
    | "static"
    | "styleguidist"
    | "gridsome"
    | "vuepress"
    | "mdx-deck"
    | "quasar"
    | "docusaurus"
    | "remix"
    | "node";

export interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}

function compress(input: string) {
    return LZString.compressToBase64(input)
        .replace(/\+/g, `-`) // Convert '+' to '-'
        .replace(/\//g, `_`) // Convert '/' to '_'
        .replace(/=+$/, ``); // Remove ending '='
}

export function getParameters(parameters: { files: IFiles; template?: ITemplate }) {
    // Node templates create retired Container Sandboxes; exports must use browser bundlers.
    if (parameters.template === "node") {
        const template = parameters.files["angular.json"] ? "angular-cli" : "parcel";
        const config = JSON.parse(parameters.files["sandbox.config.json"]?.content ?? "{}");
        parameters = {
            ...parameters,
            template,
            files: {
                ...parameters.files,
                ...(template === "angular-cli"
                    ? {
                          "index.html": parameters.files["src/index.html"],
                          "src/main.ts": {
                              ...parameters.files["src/main.ts"],
                              content: `import "@angular/compiler";\nimport "./styles.css";\n${parameters.files["src/main.ts"].content}`,
                          },
                      }
                    : {}),
                "sandbox.config.json": {
                    content: JSON.stringify({ ...config, template }),
                    isBinary: false,
                },
            },
        };
    }
    return compress(JSON.stringify(parameters));
}
