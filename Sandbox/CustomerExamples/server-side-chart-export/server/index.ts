import { generateChart } from "./generateChartImage";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
const compression = require("compression");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// create application/json parser
app.use(bodyParser.json());

app.use(cors());

app.use(express.static("dist"));
app.use(compression());

app.post("/export-chart", async (req, res, next) => {
    const buffer = await generateChart(req.body.appUrl);
    res.set("Content-Type", "image/png");
    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
