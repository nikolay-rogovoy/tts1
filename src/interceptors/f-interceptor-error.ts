
/***/
export function fInterceptorError(request: Request, response: Response, next: () => void) {
    next();
}