import * as React from "react";
import Typography from "@material-ui/core/Typography";
import viewOnGithubImg from "../../images/view-on-github.png";
import { makeStyles } from "@material-ui/core/styles";

type TProps = {
    code: string;
    githubUrl: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        maxWidth: "100%"
    }
}));

const SourceCode: React.FC<TProps> = props => {
    const classes = useStyles();
    const { githubUrl } = props;
    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const fullGithubUrl = baseGithubPath + githubUrl;

    return (
        <div className={classes.root}>
            <Typography variant="h4" variantMapping={{ h4: "p" }} gutterBottom>
                Source Code
            </Typography>
            <a href={fullGithubUrl} target="_blank">
                <img src={viewOnGithubImg} height={23} alt="View on GitHub" />
            </a>
            <pre
                className="language-javascript line-numbers"
                style={{ backgroundColor: "#272822", fontSize: "0.8em", maxHeight: 600 }}
            >
                <code style={{ fontFamily: "Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace" }}>
                    {props.code}
                </code>
            </pre>
        </div>
    );
};

export default SourceCode;
