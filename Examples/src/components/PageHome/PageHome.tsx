import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import sciChartLogoImg from "../../images/scichart_logo_2.png";
import Gallery from "./Gallery";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import SeoTags from "../SeoTags/SeoTags";

export const HOME_PAGE_TITLE = "HOMEPAGE";

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2)
    },
    content: {
        maxWidth: 1280,
        margin: "auto"
    },
    header: {
        paddingTop: 128,
        paddingBottom: 96,
        maxWidth: 960,
        margin: "auto",
        display: "flex",
        alignItems: "flex-start",
        [theme.breakpoints.down("sm")]: {
            display: "block",
            paddingTop: 64,
            paddingBottom: 32
        }
    },
    headerLogo: {},
    headerLogoTitle: {
        textAlign: "center",
        marginBottom: 0,
        fontWeight: 400,
        color: "#117d31",
        fontSize: "6rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "4rem"
        }
    },
    headerLogoSubtitle: {
        color: "#117d31"
    },
    headerText: {
        marginLeft: theme.spacing(6),
        [theme.breakpoints.down("sm")]: {
            marginLeft: 0,
            marginTop: theme.spacing(6),
            textAlign: "center"
        }
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary
    }
}));

export default function PageHome() {
    const classes = useStyles();

    React.useEffect(() => {
        updateGoogleTagManagerPage();
    }, []);

    return (
        <div className={classes.root}>
            <SeoTags
                title="SciChart Web Demo"
                keywords="SciChart Web Demo"
                description="SciChart Web Demo"
            />
            <div className={classes.content}>
                <div className={classes.header}>
                    <div className={classes.headerLogo}>
                        <Typography variant="h1" className={classes.headerLogoTitle} gutterBottom>
                            SciChart.js
                        </Typography>
                        <Typography
                            variant="h6"
                            variantMapping={{ h6: "h2" }}
                            style={{ textAlign: "center", marginBottom: 10 }}
                            gutterBottom
                        >
                            High Performance Realtime Javascript Charts
                        </Typography>
                        <div style={{ textAlign: "center" }}>
                            <img src={sciChartLogoImg} width={300} />
                        </div>
                    </div>
                    <div className={classes.headerText}>
                        <Typography
                            variant="h5"
                            variantMapping={{ h5: "h3" }}
                            className={classes.headerLogoSubtitle}
                            gutterBottom
                        >
                            With our cutting-edge, award-winning graphics engine in WebAssembly & WebGL, SciChart.js
                            brings you the world's fastest JavaScript Chart Component. Plot millions of data-points in
                            realtime, create next-generation streaming, updating financial, medical, scientific and
                            big-data business applications.
                        </Typography>
                        <ButtonGroup
                            style={{ marginTop: 30 }}
                            size="large"
                            color="primary"
                            aria-label="small outlined button group"
                        >
                            <Button href="https://www.scichart.com/downloads/" target="_blank">DOWNLOAD TRIAL</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <Gallery />
            </div>
        </div>
    );
}
