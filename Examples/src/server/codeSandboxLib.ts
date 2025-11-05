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
    return compress(JSON.stringify(parameters));
}
