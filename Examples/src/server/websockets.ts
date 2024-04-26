import * as http from "http";
import * as socketIo from "socket.io";

type TSubscription = {
    series: number[];
    startX: number;
    pointsPerUpdate: number;
    sendEvery: number;
    positive: boolean;
    scale: number;
};

const sendData = (
    socket: any,
    series: number[],
    nextx: number,
    pointsPerUpdate: number,
    sendEvery: number,
    stopX: number,
    positive: boolean,
    scale: number
): void => {
    if (!socket.wantsData) {
        return;
    }

    console.log(`Creating ${pointsPerUpdate} points for ${series.length} series starting at x=${nextx}`);

    const x: number[] = [];
    const ys: number[][] = new Array(series.length);
    for (let i = 0; i < pointsPerUpdate; i++) {
        x.push(nextx);
        nextx++;
        for (let s = 0; s < series.length; s++) {
            if (i === 0) {
                ys[s] = [];
            }
            let nextY = series[s] + Math.random() * scale - scale / 2;
            if (positive) {
                nextY = Math.abs(nextY);
            }
            ys[s].push(nextY);
            series[s] = nextY;
        }
    }
    socket.emit("data", { x, ys, sendTime: new Date().getTime() });
    if (nextx < stopX) {
        setTimeout(() => {
            sendData(socket, series, nextx, pointsPerUpdate, sendEvery, stopX, positive, scale);
        }, sendEvery);
    } else {
        socket.emit("finished");
    }
};

// tslint:disable: no-console
export const createSocketServer = (server: http.Server): void => {
    const io = new socketIo.Server(server, {
        serveClient: false,
        cors: {
            origin: ["http://localhost:8080", "http://localhost:8081", "/.csb.app$/", "/.cdpn.io$/"],
            methods: ["GET", "POST"],
        },
    });

    // listen on every connection
    io.on("connection", (socket) => {
        console.log("New user connected, socket.id", socket.id);

        socket.on("getData", (message: TSubscription) => {
            console.log("subscribe from ", socket.id, message);
            // @ts-ignore
            socket.wantsData = true;
            sendData(
                socket,
                message.series,
                message.startX,
                message.pointsPerUpdate,
                message.sendEvery,
                message.startX + 1000 * message.pointsPerUpdate,
                message.positive,
                message.scale
            );
        });

        // Disconnect
        socket.on("disconnect", () => {
            // @ts-ignore
            socket.wantsData = false;
            console.log("disconnect, socket.id", socket.id);
        });
    });
};
