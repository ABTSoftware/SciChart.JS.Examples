import * as express from "express";
import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
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
  if (process.env.NODE_ENV == "development") {
    console.log(msg, args);
  }
};

var stringPtr = ref.refType(ref.types.CString);

// Configure the native api
let nativeLicenseServer = new ffi.Library(libraryPath, {
  SciChartLicenseServer_SetAssemblyName: ["bool", ["string"]],
  SciChartLicenseServer_SetRuntimeLicenseKey: ["bool", ["string"]],
  SciChartLicenseServer_ValidateChallenge: ["string", ["string"]],
  SciChartLicenseServer_Dump: [stringPtr, []], // This outputs the full license details, similarly to what you see with LICENSE_DEBUG on in the client
  SciChartLicenseServer_GetLicenseErrors: [stringPtr, []],
});
debug("nativeLicenseServer created");

// The app name you set here must match one you have added on the MyAccount page before generating a key pair.
debug("app name", process.env.npm_package_name);
nativeLicenseServer.SciChartLicenseServer_SetAssemblyName(
  process.env.npm_package_name
);

// Set the Server key
const isValid =
  nativeLicenseServer.SciChartLicenseServer_SetRuntimeLicenseKey(
    "server key here"
  );
debug("SciChartLicenseServer_SetRuntimeLicenseKey", isValid);
if (!isValid) {
  const errors = nativeLicenseServer.SciChartLicenseServer_GetLicenseErrors();
  console.error(errors.readCString());
}

router.get("/", (req, res) => {
  const challenge = req.query.challenge.toString();
  debug("Received license challenge: ", challenge);
  const result =
    nativeLicenseServer.SciChartLicenseServer_ValidateChallenge(challenge);
  debug("returning response: ", result);
  res.end(result);
});

export { router as licenseServer };
