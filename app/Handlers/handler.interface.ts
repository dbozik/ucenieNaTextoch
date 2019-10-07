export abstract class BaseHandler<T> {
    public next: BaseHandler<T> = null;

    public run: (payload: T) => void = (payload => {
    });
}
