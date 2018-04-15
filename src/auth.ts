import * as jwt from 'jsonwebtoken';
import {Request, Response} from "express-serve-static-core";
import {IAuthPayload} from "./i-auth-payload";
import {UserNotFound} from "./user-not-found";

export class Auth {
    /**Ключ шифровки JWT*/
    static get getSecret() {
        return 'TOPSECRET';
    };

    /**Проверить токен JWT*/
    static checkAuthorization(req: Request, res: Response): IAuthPayload {
        try {
            let authorizationResult = this.decodeAuthorizationToken(req);
            if (authorizationResult) {
                // Предоставлен доступ для
                console.log(`Предоставлен доступ для ${JSON.stringify(authorizationResult)}`);
                return authorizationResult;
            } else {
                // Не авторизованный доступ
                console.error(`Неавторизованный доступ`);
                res.status(401);
                res.end();
                return null;
            }
        } catch (error) {
            if(error instanceof UserNotFound) {
                // Не валидный токен
                console.error(`Невалидный токен ${error.message}`);
                res.status(400);
                res.end();
                return null;
            } else {
                // Ошибка разбора токена
                console.error(`Ошибка разбора токена: ${error}`);
                res.status(500);
                res.end();
                return null;
            }
        }
    }

    /**Разбор заголовка*/
    static decodeAuthorizationToken(req): IAuthPayload {
        // Получить заголовок авторизации
        let token = req.get('Authorization');
        if (token != null) {
            if (token.startsWith("Bearer<") || token.startsWith("Bearer <")) {
                if (token.startsWith("Bearer <")) {
                    token = token.substring(8, token.length - 1);
                } else {
                    token = token.substring(7, token.length - 1);
                }
                try {
                    jwt.verify(token, Auth.getSecret);
                    // Токен нормальный
                    let payload = <IAuthPayload>jwt.decode(token);
                    // Не валидный токен, такого быть не должно
                    if (!payload.user.id) {
                        throw new UserNotFound(JSON.stringify(payload));
                    }
                    return payload;
                } catch (error) {
                    if (error instanceof UserNotFound) {
                        console.error(`Неопределен payload.user.idcustomerkey для токена token=${token}`);
                        throw error;
                    } else {
                        // Не авторизованный доступ
                        console.error(`Ошибка верификации токена token=${token}`);
                        return null;
                    }
                }
            } else {
                console.error(`Неправильный формат Authorization token=${token}`);
                // Не авторизованный доступ
                return null;
            }
        } else {
            console.error(`Для запроса не определен заголовок Authorization`);
            return null;
        }
    }
}
