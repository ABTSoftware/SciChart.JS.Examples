import * as React from "react";
import Typography from "@material-ui/core/Typography";
import * as Prism from "prismjs";
import viewOnGithubImg from "../../images/view-on-github.png";

type TProps = {
    code: string;
    githubUrl: string;
};

const SourceCode: React.FC<TProps> = (props) => {
    const {githubUrl} = props;
    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const fullGithubUrl = baseGithubPath + githubUrl;
    return (
        <div style={{ marginTop: 20 }}>
            <Typography variant="h4" variantMapping={{ h4: "p" }} gutterBottom>
                Source Code
            </Typography>
            <a href={fullGithubUrl} target="_blank"><img src={viewOnGithubImg} height={23}/></a>
            <div style={{ maxWidth: 900 }}>
                <pre style={{ fontSize: "0.8em" }}>
                    <code
                        className="language-javascript"
                        dangerouslySetInnerHTML={{
                            __html: Prism.highlight(props.code, Prism.languages.javascript, "javascript"),
                        }}
                    />
                </pre>
            </div>
        </div>
    );
};

export default SourceCode;
