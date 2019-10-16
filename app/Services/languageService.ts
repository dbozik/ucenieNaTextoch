import { StateService } from '.';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA';
import { GetRequestHandler, IpcMainHandler, MethodHandler, SendRequestHandler } from '../Handlers';
import { LwtApp } from '../lwt-app';
import { Language } from '../Objects';

export class LanguageService {
    private languageDA = new DA.Languages();

    public constructor() {
    }


    public init(): void {
        this.processGetLanguage();
        this.processAddLanguage();
        this.processEditLanguage();
        this.processDeleteLanguage();
        this.processGetLanguages();
        this.processSelectLanguage();
    }


    private processSelectLanguage(): void {
        const selectLanguageChain = new IpcMainHandler(ipcEvents.SELECT_LANGUAGE);
        selectLanguageChain
            .next(
                new SendRequestHandler((languageId: string) => this.languageDA.get(languageId))
            )
            .next(
                new MethodHandler((language: Language) => StateService.getInstance().language = language)
            )
            .next(
                new MethodHandler<any>(() => LwtApp.getInstance().mainWindow.webContents.send(ipcEvents.LANGUAGE_SELECTED))
            );

        selectLanguageChain.run({});

    }


    private processGetLanguages(): void {
        const getLanguages$ = () => this.languageDA.getList();

        const getLanguagesChain = new GetRequestHandler(ipcEvents.LANGUAGES, getLanguages$);
        getLanguagesChain.run({});
    }


    private processAddLanguage(): void {
        const addLanguage$ = (language: Language) => {
            return this.languageDA.addLanguage(
                language.name,
                language.dictionary,
                language.wordSeparators.toString(),
                language.sentenceSeparators.toString());
        };

        const addLanguageChain = new GetRequestHandler(ipcEvents.ADD_LANGUAGE, addLanguage$);
        addLanguageChain.run({});
    }


    private processEditLanguage(): void {
        const editLanguage$ = (language: Language) => this.languageDA.editLanguage(
            language._id,
            language.name,
            language.dictionary,
            language.wordSeparators.toString(),
            language.sentenceSeparators.toString()
        );

        const editLanguageChain = new GetRequestHandler(ipcEvents.EDIT_LANGUAGE, editLanguage$);

        editLanguageChain.run({});
    }


    private processDeleteLanguage() {
        const deleteLanguageChain = new GetRequestHandler(ipcEvents.DELETE_LANGUAGE,
            (languageId: string) => this.languageDA.delete(languageId)
        );

        deleteLanguageChain.run({});
    }


    private processGetLanguage(): void {
        const getLanguage$ = (languageId: string) => this.languageDA.get(languageId);

        const getLanguageChain = new GetRequestHandler(ipcEvents.GET_LANGUAGE, getLanguage$);
        getLanguageChain.run({});
    }
}
