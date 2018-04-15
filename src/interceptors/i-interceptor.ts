/***/
export interface IInterceptor {
    (request: Request, response: Response, next: () => void): void
}