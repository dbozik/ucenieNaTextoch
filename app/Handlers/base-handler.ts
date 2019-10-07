export abstract class BaseHandler<T> {
    public next: BaseHandler<T> = null;

    public abstract run: (payload: T) => void;
}
