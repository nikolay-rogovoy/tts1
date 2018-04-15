import * as socket_io from 'socket.io';
import * as socket_io_client from 'socket.io-client';
import * as express from "express";
import * as http from "http";

/***/
export class ServiceError {

    /**Сокет сервер*/
    io: SocketIO.Server;

    /**Сокет клиент*/
    ioClient: socket_io_client.Client = socket_io_client('http://localhost:8080/chat');

    /**Храним тут ошибки*/
    errors = [];

    /***/
    constructor(httpServer: http.Server) {
        this.io = socket_io.listen(httpServer);
        // Пользователь пришел за ошибками
        this.io.of('/error').on('connection', (socket) => {
            // И захотел их получить
            socket.on('get_errors', () => {
                console.log('get_errors', this.errors);
                // Лови
                socket.emit('chat_errors', JSON.stringify(this.errors));
            });
        });

        // Цепляемся к сервису и ждем его ошибок
        this.ioClient.on('chat_error', (err) => {
            console.log('error', err);
            // Пришла ошибка, сохраняем ее
            this.errors.push(err);
        });
        console.log('ServiceError started');
    }
}
