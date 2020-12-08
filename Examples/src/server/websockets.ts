import * as http from "http";
import * as socketIo from "socket.io";

type TSubscription = {
    seriesCount: number,
    pointsPerUpdate: number,
    sendEvery: number
};

const sendData = (socket: any, series: number[], nextx: number, pointsPerUpdate: number, sendEvery: number): void => {
    if (!socket.wantsData) { return; }
    
    console.log(`Creating ${pointsPerUpdate} points for ${series.length} series starting at x=${nextx}`);

    const x: number[] = [];
    const ys: number[][] = new Array(series.length);
    for (let i = 0; i < pointsPerUpdate; i++) {
        x.push(nextx);
        nextx++;
        for (let s = 0; s < series.length; s++) {
            if (i === 0) { ys[s] = []; }
            const nextY = series[s] + Math.random() * 10 - 5;
            ys[s].push(nextY);
            series[s] = nextY;
        }
    }
    socket.emit("data", {x, ys, sendTime: new Date().getTime()});
    if (nextx < 1000 * pointsPerUpdate) {
        setTimeout(() => {
            sendData(socket, series, nextx, pointsPerUpdate, sendEvery);
        }, sendEvery);
    }
};

// tslint:disable: no-console
export const createSocketServer = (server: http.Server): void => {
    const io = new socketIo.Server(server, { 
        serveClient: false, 
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"]
        } 
    });
        
    // listen on every connection
    io.on("connection", (socket) => {
        console.log("New user connected, socket.id", socket.id);

        socket.on("getData", (message: TSubscription) => {
            console.log( "subscribe from ", socket.id, message);
            socket.wantsData = true;
            const series: number[] = new Array(message.seriesCount).fill(0);
            sendData(socket, series, 0, message.pointsPerUpdate, message.sendEvery);
        });

        // Disconnect
        socket.on("disconnect", () => {
            socket.wantsData = false;
            console.log("disconnect, socket.id", socket.id);
        });
    });
};
