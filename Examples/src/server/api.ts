// api.js - api route module
// tslint:disable: no-console
import express = require("express");
import path = require("path");
import fs = require("fs");
import { Request, Response } from "express";
import { TBinanceCandleData } from "../commonTypes/TBinanceCandleData";
import { candlesADAUSDT } from "./BinanceData/candlesADAUSDT";
import { candlesBTCUSDT } from "./BinanceData/candlesBTCUSDT";
import { candlesDOGEUSDT } from "./BinanceData/candlesDOGEUSDT";
import { candlesETHUSDT } from "./BinanceData/candlesETHUSDT";
import { candlesXRPUSDT } from "./BinanceData/candlesXRPUSDT";
import { tq3080_DSM_2M } from "./Data/tq3080_DSM_2M";
import { TweetData } from "./Data/tweetData";
import { TBinanceQueryParams } from "./types/TBinanceQueryParams";
import { getSandboxUrlEndpoint } from "./renderCodeSandboxRedirect";
import { getStackblitzFiles } from "./services/stackblitz/getStackblitzFiles";

const router = express.Router();

const POINTS = 10000000;
const xValues = new Array(POINTS);
const yValues = new Array(POINTS);
let prevYValue = 0;
for (let i = 0; i < POINTS; i++) {
    const curYValue = Math.random() * 10 - 5;

    xValues[i] = i;
    yValues[i] = prevYValue + curYValue;

    prevYValue += curYValue;
}

// Data route
router.get("/data/:xfrom-:xto/:pointCount", (req, res) => {
    let xStart = xValues.findIndex((x) => x === Number.parseInt(req.params.xfrom));
    let xEnd = xValues.findIndex((x) => x === Number.parseInt(req.params.xto));
    xStart = Math.max(0, xStart);
    xEnd = Math.min(xEnd, POINTS);
    const pointCount = Number.parseInt(req.params.pointCount);
    const xData = xValues.slice(xStart, xEnd);
    const yData = yValues.slice(xStart, xEnd);
    if (pointCount > 0 && pointCount < xData.length / 2) {
        const interval = Math.floor(xData.length / pointCount);
        const rsX = [];
        const rsY = [];
        for (let i = 0; i < xData.length; i += interval) {
            rsX.push(xData[i]);
            rsY.push(yData[i]);
        }
        res.send({ x: rsX, y: rsY });
    } else {
        res.send({ x: xData, y: yData });
    }
});

router.get("/license", (req, res) => {
    const domainLicense = process.env.SCLICENSE;
    console.log("returning license: " + domainLicense);
    res.send(domainLicense);
});

router.get("/lidarData", (req, res) => {
    console.log("returning lidar data");
    res.send(tq3080_DSM_2M);
});

router.get("/tweetData", (req, res) => {
    console.log("returning tweet data");
    res.send(TweetData);
});

router.get("/get-binance-candles", (req, res) => {
    const params = req.query as TBinanceQueryParams;
    let data: TBinanceCandleData;
    switch (params.symbol) {
        case "ADAUSDT":
            data = candlesADAUSDT;
            break;
        case "BTCUSDT":
            data = candlesBTCUSDT;
            break;
        case "DOGEUSDT":
            data = candlesDOGEUSDT;
            break;
        case "ETHUSDT":
            data = candlesETHUSDT;
            break;
        case "XRPUSDT":
            data = candlesXRPUSDT;
            break;
    }
    res.send(data);
});

// example is the name framework and platform is in the query
router.get("/sandboxurl/:example", (req, res) => {
    return getSandboxUrlEndpoint(req, res);
});

// Get files for StackBlitz
router.get("/stackblitz/files/:example", getStackblitzFiles);

export { router as api };
