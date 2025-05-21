import * as express from "express";
import { DataType, open, close, define } from "ffi-rs";
import path = require("path");
import os = require("os");

const router = express.Router();

// If your application will need to run on multiple platforms you may need to make multiple native lbraries available and pick the correct name and path here
const libraryName =
  os.platform() === "win32"
    ? "SciChartLicenseServer.dll"
    : "LibSciChartLicenseServer.so";
const libraryPath = path.join(__dirname, libraryName);

const debug = (msg: string, ...args: any[]) => {
  console.log(msg, args);
};

const library = "SciChartLicenseServer";
// Open the dynamic library
open({ library, path: libraryPath });
// Configure the native api
let nativeLicenseServer = define({
  SciChartLicenseServer_SetAssemblyName: {
    library,
    retType: DataType.Boolean,
    paramsType: [DataType.String],
  },
  SciChartLicenseServer_SetRuntimeLicenseKey: {
    library,
    retType: DataType.Boolean,
    paramsType: [DataType.String],
  },
  SciChartLicenseServer_ValidateChallenge: {
    library,
    retType: DataType.String,
    paramsType: [DataType.String],
  },
  SciChartLicenseServer_Dump: {
    library,
    retType: DataType.String,
    paramsType: [],
  },
  SciChartLicenseServer_GetLicenseErrors: {
    library,
    retType: DataType.String,
    paramsType: [],
  },
});

debug("nativeLicenseServer created");

// The app name you set here must match one you have added on the MyAccount page before generating a key pair.
const APP_NAME = "scichart-nodejs-server-licensing";
debug("app name", APP_NAME);
nativeLicenseServer.SciChartLicenseServer_SetAssemblyName([APP_NAME]);

// Set the Server key
const SERVER_KEY = "enter-your-server-key-here";
const isValid = nativeLicenseServer.SciChartLicenseServer_SetRuntimeLicenseKey([
  SERVER_KEY,
]);
debug("SciChartLicenseServer_SetRuntimeLicenseKey", isValid);
if (!isValid) {
  const errors = nativeLicenseServer.SciChartLicenseServer_GetLicenseErrors([]);
  console.error(errors);
}

router.get("/", (req, res) => {
  debug("Query parameters: ", req.query);
  const challenge = req.query.challenge.toString();
  debug("Received license challenge: ", challenge);
  const result = nativeLicenseServer.SciChartLicenseServer_ValidateChallenge([
    challenge,
  ]);
  debug("returning response: ", result);
  res.end(result);
});

// Callback to close the library on shutdown
const closeLicenseServer = () => {
  debug("Closing licenseServer");
  close(library);
};

export { router as licenseServer, closeLicenseServer };
