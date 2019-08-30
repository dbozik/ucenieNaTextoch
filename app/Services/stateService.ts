export class StateService {
    private static instance: StateService;

    private constructor() {
    }

    private _userId: string;

    public get userId(): string {
        return this._userId;
    }

    public set userId(value: string) {
        this._userId = value;
    }

    static getInstance(): StateService {
        if (!StateService.instance) {
            StateService.instance = new StateService();
        }

        return StateService.instance;
    }
}
