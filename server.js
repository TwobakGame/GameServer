import http from 'http';
import { Server } from 'socket.io';
import express from 'express';


const app = express();
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

wsServer.on('connection', (socket) => {

    socket["roomcode"] = 0;

    socket.onAny((event) => {
        console.log(`이벤트 발생 : ${event}`);
    });
    socket.on("join", (room) => {
        socket.join(room);
        socket["roomcode"] = room;
    });
    socket.on("offer", (offer) => {
        socket.to(socket.roomcode).emit("offer", offer);
    });
    socket.on("answer", (answer) => {
        socket.to(socket.roomcode).emit("answer", answer);
    });
    socket.on("ice", (ice) => {
        socket.to(socket.roomcode).emit("ice", ice);
    });
})


const handleListen = () => console.log('Listening on http://localhost:443');
httpServer.listen(443, handleListen);