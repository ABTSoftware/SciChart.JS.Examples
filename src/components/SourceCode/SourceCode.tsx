import * as React from "react";
import Typography from "@material-ui/core/Typography";
import * as Prism from "prismjs";

type TProps = {
    code: string;
};

const SourceCode: React.FC<TProps> = props => {
    return (
        <div style={{ marginTop: 20 }}>
            <Typography variant="h4" variantMapping={{ h4: "p" }} gutterBottom>
                Source Code
            </Typography>
            <div style={{ whiteSpace: "pre-wrap"}}
                dangerouslySetInnerHTML={{
                    __html: Prism.highlight(props.code, Prism.languages.javascript, "javascript")
                }}
            />
        </div>
    );
};

export default SourceCode;
