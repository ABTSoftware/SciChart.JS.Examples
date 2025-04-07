import express from "express";
import cors from "cors";
import compression from "compression";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import chalk from "chalk";

import * as http from "http";

import { createSocketServer } from "./websockets";
import { populateSourceFilesCache } from "./renderCodeSandboxRedirect";
import { populatePrerenderedPageCache } from "./services/pageRender";
import { mainRouter } from "./routes/MainRouter";

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(compression({ filter: shouldCompress }));

const server = http.createServer(app);
const io = createSocketServer(server);

function shouldCompress(req: Request, res: Response) {
    if (req.headers["x-no-compression"]) {
        return false;
    }
    return compression.filter(req, res);
}

app.use(mainRouter);

// Prerendered pages cache structure of URL/HTML pairs
populateSourceFilesCache()
    .then(populatePrerenderedPageCache)
    .then(() => {
        server.listen(port, () => {
            console.log(
                `Serving at http://${host}:${port} ${chalk.green("✓")}. ${chalk.red("To run in dev mode: npm run dev")}`
            );
        });
    });
