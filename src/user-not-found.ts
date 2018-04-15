/**Добавление маршрутов*/
export class UserNotFound extends Error {
    constructor(public message: string) {
        super(message);
    }
}
