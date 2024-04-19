import * as React from "react";

import CloseIcon from "@material-ui/icons/Close";
import classes from "./SourceCode.module.scss";

type TProps = {
    code: string;
    githubUrl: string;
    onClose: () => void;
};

const SourceCode: React.FC<TProps> = (props) => {
    const code = `${props.code}`;
    React.useEffect(() => {
        window.Prism?.highlightAll();
    }, []);
    return (
        <div className={classes.SourceCode}>
            <div className={classes.SourceCodeHeader}>
                <h4>Source Code</h4>
                <CloseIcon onClick={props.onClose} />
            </div>

            <div className={classes.SourceCodeWrapper}>
                <pre className="language-javascript line-numbers">
                    <code
                        style={{
                            fontFamily: "Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace",
                        }}
                    >
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default SourceCode;
