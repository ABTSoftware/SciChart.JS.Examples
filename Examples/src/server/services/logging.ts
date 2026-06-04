import winston from "winston";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const isDevelopment = (process.env.NODE_ENV || "development") === "development";

const level = () => {
    return isDevelopment ? "debug" : "http";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports: winston.transport[] = [new winston.transports.Console()];
if (isDevelopment) {
    transports.push(
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "logs/all.log" })
    );
}

export const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
