import { ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { StateService } from ".";
import * as Services from '.';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA/namespace';
import { GetRequestHandler } from "../Handlers/get-request.handler";
import { IpcMainHandler } from "../Handlers/ipc-main.handler";
import { MethodHandler } from "../Handlers/method.handler";
import { SendRequestHandler } from "../Handlers/send-request.handler";
import { Language } from '../Objects/Language';

export class LanguageService {
    private languageDA = new DA.Languages();

    public constructor() {
    }


    public init(): void {
        this.getLanguage();
        this.processSelectedLanguage();
    }


    public getList(userId: string): Observable<Language[]> {
        return this.languageDA.getList(userId);
    }

    public get(id: string): Observable<Language> {
        return this.languageDA.get(id);
    }

    public add(event, language: Language): void {
        const userId = Services.StateService.getInstance().userId;

        (new DA.Languages()).addLanguage(
            language.name,
            language.dictionary,
            userId,
            language.wordSeparators.toString(),
            language.sentenceSeparators.toString());
    }


    public bindSendLanguages() {
        this.bindEvent(ipcEvents.LANGUAGES, (arg) => {
            const userId = Services.StateService.getInstance().userId;

            return (new DA.Languages()).getList(userId);
        });
    }


    public bindAddLanguage(): void {
        this.bindEvent(ipcEvents.ADD_LANGUAGE, (arg: Language) => {
            const userId = Services.StateService.getInstance().userId;

            return (new DA.Languages()).addLanguage(
                arg.name,
                arg.dictionary,
                userId,
                arg.wordSeparators.toString(),
                arg.sentenceSeparators.toString());
        });
    }


    public bindEditLanguage() {
        this.bindEvent<Language>(ipcEvents.EDIT_LANGUAGE, (arg: Language) => {
            return (new DA.Languages()).editLanguage(
                arg._id,
                arg.name,
                arg.dictionary,
                arg.wordSeparators.toString(),
                arg.sentenceSeparators.toString()
            );
        });
    }


    public bindDeleteLanguage() {
        this.bindEvent<string>(ipcEvents.DELETE_LANGUAGE, (arg: string) => {
            return (new DA.Languages()).delete(arg);
        });
    }


    private getLanguage(): void {
        const getLanguage$ = (languageId: string) => this.languageDA.get(languageId);

        const getLanguageChain = new GetRequestHandler(ipcEvents.GET_LANGUAGE, getLanguage$);
        getLanguageChain.run({});
    }


    private bindEvent<T>(eventName: ipcEvents, dbRequest: (arg: T) => Observable<T>): void {
        ipcMain.on(eventName, (event, arg: T) => {
            dbRequest(arg).subscribe((response: any) => {
                event.sender.send(eventName + '-reply', response);
            });
        });
    }


    private processSelectedLanguage(): void {
        const selectedLanguageChain = new IpcMainHandler(ipcEvents.LANGUAGE_SELECTED);
        selectedLanguageChain
            .next(
                new SendRequestHandler((languageId: string) => this.languageDA.get(languageId))
            )
            .next(
                new MethodHandler((language: Language) => StateService.getInstance().language = language)
            );

        selectedLanguageChain.run({});
    }
}
