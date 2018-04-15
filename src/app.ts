import {Router} from 'express-serve-static-core';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {RestRouter} from './rest-router';
import {ServiceError} from './service-error';
import {ServiceChat} from './service-chat';
import * as http from 'http'
import {IInterceptor} from "./interceptors/i-interceptor";
import {fInterceptorError} from "./interceptors/f-interceptor-error";

/***/
class Service {

    /***/
    app: express.Application = express();

    /***/
    httpServer: http.Server = http.createServer(this.app);

    /**Сервис ошибок*/
    serviceError: ServiceError = new ServiceError(this.httpServer);

    /**Сервис чата*/
    serviceChat: ServiceChat = new ServiceChat(this.httpServer);

    /***/
    constructor() {
        this.configureExpress();
        this.startServer();
        console.log('Service started');
    }

    /***/
    configureExpress() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "'GET,POST,DELETE,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
        this.app.use(bodyParser.urlencoded({extended: true}));

        /**
         * https://stackoverflow.com/questions/19917401/error-request-entity-too-large
         * Размер для парсера, обязательно нужно установить
         * */

        let ptrInterceptorError: IInterceptor = fInterceptorError;
        this.app.use(fInterceptorError);
        this.app.use(bodyParser.json({limit: '50mb'}));
        let router: Router = express.Router();
        this.app.use('/api', router);
        RestRouter.handleRoutes(router);
    };

    /**Запуск сервера*/
    startServer() {
        this.app.listen(8080, () => {
            console.log("startServer - OK");
        });
    };

}

/***/
const service = new Service();
