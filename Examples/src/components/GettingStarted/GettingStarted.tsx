import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/system"; // or '@mui/material/styles' if using styled

const Root = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const GettingStarted = () => {
    return (
        <Root>
            <Typography variant="h5" variantMapping={{ h5: "p" }} gutterBottom>
                Getting Started
            </Typography>
            <div>Getting started text....</div>
        </Root>
    );
};

export default GettingStarted;
