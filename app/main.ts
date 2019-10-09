import { BrowserWindow, ipcMain } from 'electron';
import * as Services from '../app/Services';
import { Routes } from '../web/shared/routes.enum';
import { LwtApp } from './lwt-app';
import { Navigation } from './navigation';

const PORT: number = 31411;

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

        ipcMain.on('main-open-text', Main.openText);

        languageService.bindSendLanguages();
        languageService.bindAddLanguage();
        languageService.bindEditLanguage();
        languageService.bindDeleteLanguage();
    }


    private static loadServices(): void {
        (new Services.UserService()).init();
        (new Services.TextService()).init();
        (new Services.LanguageService()).init();
    }


    private static openText(event, arg) {
        Main.lwtApp.mainWindow.loadURL(`http://localhost:${PORT}/${Routes.READ_TEXT}/${arg}`);
    }
}
