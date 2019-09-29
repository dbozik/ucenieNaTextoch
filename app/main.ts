import { BrowserWindow, ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as Services from '../app/Services';
import * as Objects from '../app/Objects';
import { ipcEvents } from '../web/shared/ipc-events.enum';
import { Routes } from '../web/shared/routes.enum';
import { Navigation } from './navigation';

const PORT: number = 31411;

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

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

        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onReady);

        const languageService = new Services.LanguageService();

        Main.bindEvent<Objects.Text>(ipcEvents.ADD_TEXT, (new Services.TextService()).saveText);

        ipcMain.on('main-open-text', Main.openText);
        ipcMain.on(ipcEvents.LOGIN, Main.login);
        ipcMain.on(ipcEvents.SIGNUP, Main.signup);

        languageService.bindSendLanguages();
        languageService.bindAddLanguage();
        languageService.bindEditLanguage();
        languageService.bindDeleteLanguage();
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onReady() {
        const navigation = new Navigation();

        navigation.closeMenu();

        Main.mainWindow = new Main.BrowserWindow({ width: 1500, height: 927 });

        const environment: 'dev' | 'prod' = 'dev';

        Main.mainWindow.loadFile('./dist/web/index.html');
        navigation.openPage(Routes.LOGIN);
        // if (environment === 'dev') {
        //     Main.mainWindow.loadURL(`http://localhost:${PORT}`);
        // } else {
        //     Main.mainWindow.loadFile('./dist/web/index.html');
        // }

        Main.mainWindow.webContents.openDevTools();

        Main.mainWindow.on('closed', Main.onClose);
    }

    private static openText(event, arg) {
        Main.mainWindow.loadURL(`http://localhost:${PORT}/${Routes.READ_TEXT}/${arg}`);
    }

    private static login(event, arg) {
        const userService = new Services.UserService();
        userService.signin(arg.username, arg.password).subscribe((success: boolean) => {
            if (success) {
                (new Navigation()).openMenu();
                (new Navigation()).openPage(Routes.TEXTS);
            } else {
                Main.mainWindow.webContents.send(ipcEvents.LOGIN_FAILED);
                ipcMain.emit(ipcEvents.LOGIN_FAILED);
            }
        }, (error) => console.dir(error));
    }

    private static signup(event, arg) {
        const userService = new Services.UserService();

        userService.signup(arg.username, arg.password, arg.email).subscribe((success: boolean) => {
            (new Navigation()).openPage(Routes.LOGIN);
        }, (error) => console.dir(error));
    }


    private static bindEvent<T>(eventName: ipcEvents, dbRequest: (arg: T) => Observable<T>): void {
        ipcMain.on(eventName, (event, arg: T) => {
            dbRequest(arg).subscribe((response: any) => {
                event.sender.send(eventName + '-reply', response);
            });
        });
    }
}
