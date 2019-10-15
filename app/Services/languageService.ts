import * as Services from '.';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA';
import { GetRequestHandler } from '../Handlers';
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
    }


    private processGetLanguages(): void {
        const getLanguages$ = () => {
            const userId = Services.StateService.getInstance().userId;

            return this.languageDA.getList(userId);
        };

        const getLanguagesChain = new GetRequestHandler(ipcEvents.LANGUAGES, getLanguages$);
        getLanguagesChain.run({});
    }


    private processAddLanguage(): void {
        const addLanguage$ = (language: Language) => {
            const userId = Services.StateService.getInstance().userId;

            return this.languageDA.addLanguage(
                language.name,
                language.dictionary,
                userId,
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
