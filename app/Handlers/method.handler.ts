import { BaseHandler } from './base-handler';

export class MethodHandler<T> extends BaseHandler<T> {
    constructor(
        private method: (args: any) => T
    ) {
        super();
    }


    public run = (payload: T): void => {
        const result = this.method(payload);

        if (this._next) {
            this._next.run(result);
        }
    }
}
