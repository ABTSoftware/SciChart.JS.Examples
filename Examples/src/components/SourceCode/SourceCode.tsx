import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import classes from "./SourceCode.module.scss";

type TProps = {
    code: string;
    githubUrl: string;
    onClose: () => void;
};

const SourceCode: React.FC<TProps> = props => {
    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";

    return (
        <div className={classes.SourceCode}>
            <div className={classes.SourceCodeHeader}>
                <h4>Source Code</h4>
                <CloseIcon onClick={props.onClose} />
            </div>

            <div className={classes.SourceCodeWrapper}>
                <pre
                    className="language-javascript line-numbers"
                    style={{
                    }}
                >
                    <code style={{ fontFamily: "Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace" }}>
                        {props.code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default SourceCode;
