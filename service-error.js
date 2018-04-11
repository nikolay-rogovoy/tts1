const io = require('socket.io').listen(8090);
const ioClient = require('socket.io-client');

/***/
class ServiceError {
    /***/
    constructor() {
        // Храним тут ошибки
        this.errors = [];
        // Пользователь пришел за ошибками
        io.sockets.on('connection', (socket) => {
            // И захотел их получить
            socket.on('get_errors', () => {
                console.log('get_errors', this.errors);
                // Лови
                socket.emit('errors', JSON.stringify(this.errors));
            });
        });

        // Цепляемся к сервису и ждем его ошибок
        this.inSocket = ioClient('http://localhost:8080');
        this.inSocket.on('myerror', (err) => {
            console.log('error', err);
            // Пришла ошибка, сохраняем ее
            this.errors.push(err);
        });

    }
}

const serviceError = new ServiceError();
