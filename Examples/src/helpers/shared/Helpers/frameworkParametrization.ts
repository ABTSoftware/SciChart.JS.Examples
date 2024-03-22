import { EPageFramework, FRAMEWORK_NAME, TTitleTemplate } from "../../../components/AppRouter/pages";

export const getTitle = (title: TTitleTemplate, framework: EPageFramework) => {
    return typeof title === "string" ? title : title(FRAMEWORK_NAME[framework]);
};
