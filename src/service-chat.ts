import * as socket_io from "socket.io";
import * as express from "express";
import * as http from "http";

/**Сервис чата*/
export class ServiceChat {

    /**Сокет сервер*/
    io: SocketIO.Server;

    /***/
    constructor(httpServer: http.Server) {
        this.io = socket_io.listen(httpServer);
        // Ждем входящие соединения
        this.io.of('/chat').on('connection', (socket) => {
            socket.broadcast.emit('user_connected', {code: 2, message: `Подключился пользователь ${socket.id}`});
            // Пришло сообщение от чувака
            socket.on('message', (msg) => {
                console.log('message', msg);
                if (msg.msg.length > 5) {
                    // Оно слишком длинное
                    console.log('error message', msg);
                    socket.broadcast.emit('chat_error', {code: 1, message: 'Сообщение слишком длинное'});
                } else {
                    // Оно нормальное
                    // TODO - Отправить сообщение куда-то
                    socket.emit('message', msg);
                }
            });
            socket.on('disconnect', () => {
                socket.broadcast.emit('user_disconnected', {code: 3, message: `Отключился пользователь ${socket.id}`});
            });

        });
        console.log('ServiceChat started');
    }
}
