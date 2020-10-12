import Typography from "@material-ui/core/Typography";
import * as React from "react";

type TProps = {
    title: string;
    subtitle?: string;
};

const Title: React.FC<TProps> = props => {
    return (
        <React.Fragment>
            <Typography variant="h4" variantMapping={{ h4: "h1" }} gutterBottom>
                {props.title}
            </Typography>
            {props.subtitle && (
                <div style={{ maxWidth: 800, marginBottom: 20 }}>
                    <Typography variant="body1" variantMapping={{ body1: "h3" }} style={{ color: "dimgray" }}>
                        {props.subtitle}
                    </Typography>
                </div>
            )}
        </React.Fragment>
    );
};

export default Title;
