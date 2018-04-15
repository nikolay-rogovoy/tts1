import {IController} from './i-controller';
import {Request, Response} from 'express-serve-static-core';
import {Auth} from '../auth';
import {IAuthPayload} from "../i-auth-payload";
import * as jwt from "jsonwebtoken";
import {IAuthUser} from "../i-auth-user";

/***/
export class LoginController implements IController {

    /***/
    constructor() {
    }

    /***/
    handler(req: Request, res: Response) {
        console.log('handleRoutes /login');
        let userUnfo = req.body;

        // Проверка объекта на правильность
        if (userUnfo.user == null) {
            res.json({message: `Нет поля user`, success: false});
            return;
        }
        if (userUnfo.pass == null) {
            res.json({message: `Нет поля pass`, success: false});
            return;
        }

        let user = userUnfo.user;
        let pass = userUnfo.pass;

        // Обязательно должны быть заполнены
        if (user === '' || pass === '') {
            res.json({message: `Логин и пароль не должны быть пустыми`, success: false});
            return;
        }

        if ((user === 'test1' && pass === 'test1') || (user === 'test2' && pass === 'test2')) {
            let payload = <IAuthPayload>{
                iss: 'my_issurer',
                aud: 'World',
                iat: 1400062400223,
                typ: '/online/transactionstatus/v2',
                user: <IAuthUser>{
                    id: 0,
                    name: user
                }
            };

            // Получить токен
            //let token =
            jwt.sign(payload, Auth.getSecret, function (errorJWT, token) {
                if (errorJWT) {
                    // Ошибка получения токена
                    res.status(500);
                    res.json({message: errorJWT, success: false});
                    return;
                } else {
                    // Вернуть токен
                    res.json(
                        {
                            message: 'Success',
                            success: true,
                            token: token,
                            user: payload.user
                        });
                    return;
                }
            });
        } else {
            res.json({message: `Неправильный логин/пароль`, success: false});
            return;
        }
    }
}
