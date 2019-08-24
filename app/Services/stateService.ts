export class StateService {
    private static instance: StateService;
    private _userId: string;

    private constructor() {
    }

    static getInstance(): StateService {
        if (!StateService.instance) {
            StateService.instance = new StateService();
        }

        return StateService.instance;
    }

    public set userId(value: string) {
        this._userId = value;
    }


    public get userId(): string {
        return this._userId;
    }
}