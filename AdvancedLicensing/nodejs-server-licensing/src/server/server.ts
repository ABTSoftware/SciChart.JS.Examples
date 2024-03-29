import * as chalk from "chalk";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import { licenseServer } from "./licenseServer";

const app = express();
app.use(cors());

app.use(express.static("build"));

// The client expects the licnese validation endpoint to be at /api/license.
// If you need to use a different endpoint, tell the client by calling SciChartSurface.setServerLicenseEndpoint("/custom/endpoint")
app.use("/api/license", licenseServer);

const server = http.createServer(app);

server.listen(3000, "0.0.0.0", () => {
  console.log(
    `Serving at http://localhost:3000 ${chalk.green("✓")}. ${chalk.red(
      "To run in dev mode: npm run dev"
    )}`
  );
});
