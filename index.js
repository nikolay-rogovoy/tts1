var io = require('socket.io').listen(8080);

/***/
class Service {

    /***/
    constructor() {
        // Ждем входящие соединения
        io.sockets.on('connection', (socket) => {
            // Пришло сообщение от чувака
            socket.on('message', (msg) => {
                console.log('message', msg);
                if (msg.msg.length > 5) {
                    // Оно слишком длинное
                    console.log('error message', msg);
                    socket.broadcast.emit('myerror', {code: 1, message: 'Сообщение слишком длинное'});
                } else {
                    // Оно нормальное
                    socket.emit('message', msg);
                }
            });
        });
    }
}

/***/
const service = new Service();
