import {IController} from './i-controller';
import {Request, Response} from 'express-serve-static-core';

/***/
export class TestController implements IController {

    /***/
    constructor() {
    }

    /***/
    handler(req: Request, res: Response) {
        console.log('handleRoutes /test get');
        res.json({message: `Test api - OK. (get)`});
    }
}
