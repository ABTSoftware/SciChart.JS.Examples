export interface IHttpError extends Error {
    status: number;
}

abstract class HttpError extends Error implements IHttpError {
    public readonly status: number;
}

export class NotFoundError extends HttpError {
    public readonly status = 404;
}
