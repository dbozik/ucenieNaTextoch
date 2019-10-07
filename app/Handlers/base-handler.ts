export abstract class BaseHandler<T> {
    public abstract run: (payload: T) => void;
    protected _next: BaseHandler<T> = null;
    protected _error: BaseHandler<T> = null;

    public next: (handler: BaseHandler<T>) => BaseHandler<T> =
        (handler: BaseHandler<T>) => {
            this._next = handler;
            return this._next;
        }


    public error: (handler: BaseHandler<T>) => BaseHandler<T> =
        (errorHandler: BaseHandler<T>) => {
            this._error = errorHandler;
            return this._error;
        }
}
