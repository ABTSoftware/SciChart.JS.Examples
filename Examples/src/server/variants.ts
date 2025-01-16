import * as path from "path";
import express from "express";
import { getRequestedExample } from "./renderCodeSandboxRedirect";
import { getAngularSrc } from "./services/sandbox/angularConfig";
import { getVanillaSrc } from "./services/sandbox/vanillaTsConfig";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
import { IHttpError } from "./Errors";

const router = express.Router();
const basePath = path.join(__dirname, "Examples");

router.get("/:example", async (req, res) => {
    try {
        const currentExample = getRequestedExample(req, res)?.currentExample;
        const folderPath = path.join(basePath, currentExample.filepath);
        const [vanillaSrcFetchResult, angularSrcFetchResult] = await Promise.allSettled([
            getVanillaSrc(folderPath),
            getAngularSrc(folderPath),
        ]);
        const vanillaSrc = vanillaSrcFetchResult.status === "fulfilled" && vanillaSrcFetchResult.value;
        const angularSrc = angularSrcFetchResult.status === "fulfilled" && angularSrcFetchResult.value;
        return res.send({ [EPageFramework.Vanilla]: vanillaSrc, [EPageFramework.Angular]: angularSrc });
    } catch (err) {
        const error = err as IHttpError;
        return res.status(error.status ?? 500).send(error.status && error.message);
    }
});

export { router as getAvailableVariants };
