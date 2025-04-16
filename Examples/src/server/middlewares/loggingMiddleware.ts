import type { Request } from "express";
import morgan, { StreamOptions } from "morgan";

import { Logger } from "../services/logging";

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message),
};

const skip = () => {
    // const env = process.env.NODE_ENV || "development";
    // return env !== "development";
    return false;
};

morgan.token("route", (req: Request) => {
    return req.route ? req.route.path : "N/A";
});

// Build the morgan middleware
export const morganMiddleware = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    ":method :url :route :status :res[content-length] - :response-time ms",
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip, immediate: false }
);
