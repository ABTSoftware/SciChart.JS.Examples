export enum SandboxPlatform {
    CodeSandbox = "codesandbox",
    StackBlitz = "stackblitz",
}

export const getEmbedUrl = (platform: SandboxPlatform, id: string, fontSize: number = 10): string => {
    switch (platform) {
        case SandboxPlatform.StackBlitz:
            return `https://stackblitz.com/edit/${id}?embed=1&file=src/App.tsx&hideNavigation=1&view=editor`;
        case SandboxPlatform.CodeSandbox:
        default:
            return `https://codesandbox.io/embed/${id}?fontsize=${fontSize}&view=split`;
    }
};

export const platformIcons: Record<SandboxPlatform, string> = {
    [SandboxPlatform.CodeSandbox]: "codesandbox",
    [SandboxPlatform.StackBlitz]: "stackblitz",
};
