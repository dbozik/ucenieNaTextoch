import { BrowserWindow, ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import * as Objects from '../app/Objects';
import * as Services from '../app/Services';
import { ipcEvents } from '../web/shared/ipc-events.enum';
import { Routes } from '../web/shared/routes.enum';
import { LwtApp } from './lwt-app';
import { Navigation } from './navigation';

const PORT: number = 31411;

export default class Main {
    public static lwtApp: LwtApp;
    public static navigation: Navigation;

    public static bindSendData<T>(eventName: ipcEvents, getData: () => Observable<T>) {
        ipcMain.on(eventName, (event, args) => {
            getData().pipe(take(1)).subscribe((data) => {
                event.sender.send(eventName + '-reply', data);
                event.sender.removeAllListeners(eventName + '-reply');
            });
        });
    }

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

        // Main.bindEvent<Objects.Text>(ipcEvents.ADD_TEXT, (new Services.TextService()).saveText);

        ipcMain.on('main-open-text', Main.openText);

        languageService.bindSendLanguages();
        languageService.bindAddLanguage();
        languageService.bindEditLanguage();
        languageService.bindDeleteLanguage();
    }


    private static loadServices(): void {
        (new Services.UserService()).init();
        (new Services.TextService()).init();
    }


    private static openText(event, arg) {
        Main.lwtApp.mainWindow.loadURL(`http://localhost:${PORT}/${Routes.READ_TEXT}/${arg}`);
    }


    private static bindEvent<T>(eventName: ipcEvents, dbRequest: (arg: T) => Observable<T>): void {
        ipcMain.on(eventName, (event, arg: T) => {
            dbRequest(arg).subscribe((response: any) => {
                event.sender.send(eventName + '-reply', response);
            });
        });
    }
}
