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
    socket.on("join", (room, type) => {
        const roomSize = wsServer.sockets.adapter.rooms.get(room)?.size || 0;
        console.log(room, " 인원수 : " , roomSize);
        if(type === "manager") {
            if(roomSize === 0) {
                socket.join(room);
                socket["roomcode"] = room;
            }
            else {
                socket.emit("error", "올바르지 않은 방 생성입니다. 다시 시도해주세요.");
            }
        }
        else if(type === "client") {
            if(roomSize === 1) {
                socket.join(room);
                socket["roomcode"] = room;
            }
            else {
                socket.emit("error", "입장 불가능한 방 번호입니다.");
            }
        }
        
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