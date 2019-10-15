import { BrowserWindow } from 'electron';
import * as Services from '../app/Services';
import { LwtApp } from './lwt-app';
import { Navigation } from './navigation';

export default class Main {
    public static lwtApp: LwtApp;
    public static navigation: Navigation;

    static main(
        app: Electron.App,
        browserWindow: typeof BrowserWindow,
    ) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class1 has no dependencies.  This
        // makes the code easier to write tests for

        Main.lwtApp = new LwtApp(app, browserWindow);
        Main.lwtApp.init();
        Main.navigation = new Navigation();

        Main.loadServices();

        const languageService = new Services.LanguageService();

        languageService.bindSendLanguages();
        languageService.bindAddLanguage();
        languageService.bindEditLanguage();
        languageService.bindDeleteLanguage();
    }


    private static loadServices(): void {
        (new Services.UserService()).init();
        (new Services.TextService()).init();
        (new Services.LanguageService()).init();
        (new Services.WordService()).init();
    }
}
