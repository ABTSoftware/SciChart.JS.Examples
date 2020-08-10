import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

const divElementId = "chart";
export const HOME_PAGE_TITLE = "Homepage super-duper"

export default function PageHome() {
    React.useEffect(() => {
        // drawExample();
    }, []);

    return (
        <div>
            <div style={{ maxWidth: 800, marginBottom: 20 }}>
                <Typography variant="body1" style={{ color: "blue" }}>
                    Homepage bla-bla-bla
                </Typography>
            </div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <br />
            <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                <Button>Button</Button>
            </ButtonGroup>
        </div>
    );
}
