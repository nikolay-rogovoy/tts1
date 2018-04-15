import {Router} from 'express-serve-static-core';
import {TestController} from "./controllers/test-controller";
import {LoginController} from "./controllers/login-controller";

/**Класс обработки маршрутов*/
export class RestRouter {

    static handleRoutes(router: Router): void {
        let cnt = null;

        // test
        cnt = new TestController();
        router.get('/test', cnt.handler.bind(cnt));

        // Получение JWT Токена
        cnt = new LoginController();
        router.post('/login', cnt.handler.bind(cnt));
    }
}
