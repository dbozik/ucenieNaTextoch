import { Language } from "../Objects";

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

    private _language: Language;

    public get language(): Language {
        return this._language;
    }


    public set language(value: Language) {
        this._language = value;
    }


    static getInstance(): StateService {
        if (!StateService.instance) {
            StateService.instance = new StateService();
        }

        return StateService.instance;
    }
}
