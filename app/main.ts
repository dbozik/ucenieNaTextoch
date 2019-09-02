import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserWindow, ipcMain, Menu } from 'electron';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import * as Services from '../app/Services/namespace';
import { ipcEvents } from '../web/shared/ipc-events.enum';
import { Routes } from '../web/shared/routes.enum';

interface AngularWindow extends Window {
    router: Router;
    ngZone: NgZone;
}

declare var window: AngularWindow;
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
        browserWindow: typeof BrowserWindow) {
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

        ipcMain.on('main-open-text', Main.openText);
        ipcMain.on(ipcEvents.LOGIN, Main.login);
        ipcMain.on(ipcEvents.SIGNUP, Main.signup);

        languageService.bindSendLanguages();
        languageService.bindAddLanguage();
        languageService.bindEditLanguage();
        ipcMain.on(ipcEvents.DELETE_LANGUAGE, languageService.delete);
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
        Main.closeMenu();

        Main.mainWindow = new Main.BrowserWindow({width: 800, height: 600});

        const environment: 'dev' | 'prod' = 'dev';

        Main.mainWindow.loadFile('./dist/web/index.html');
        Main.openPage(Routes.LOGIN);
        // if (environment === 'dev') {
        //     Main.mainWindow.loadURL(`http://localhost:${PORT}`);
        // } else {
        //     Main.mainWindow.loadFile('./dist/web/index.html');
        // }

        Main.mainWindow.webContents.openDevTools();

        Main.mainWindow.on('closed', Main.onClose);
    }

    private static openMenu() {
        const mainMenuTemplate = [
            {
                label: 'Add Text!',
            },
            {
                label: 'Texts',
                click: () => {
                    Main.openPage(Routes.TEXTS);
                },
            },
            {
                label: 'Vocabulary',
            },
            {
                label: 'Settings',
                click: () => {
                    Main.openPage(Routes.SETTINGS);
                },
            },
            {
                label: 'Signout',
                click: () => {
                    Main.closeMenu();
                    Main.openPage(Routes.LOGIN);
                },
            }
        ];

        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
    }

    private static closeMenu() {
        Menu.setApplicationMenu(null);
    }

    private static openPage(page: string): void {
        const javascript: string = wrapFn(() => {
            window.ngZone.run(() => {
                window.router.navigateByUrl(`/${page}`);
            });
        }).replace('${page}', page);

        Main.mainWindow.webContents.executeJavaScript(javascript);
    }

    private static openText(event, arg) {
        Main.mainWindow.loadURL(`http://localhost:${PORT}/${Routes.READ_TEXT}/${arg}`);
    }

    private static login(event, arg) {
        const userService = new Services.UserService();
        userService.signin(arg.username, arg.password).subscribe((success: boolean) => {
            if (success) {
                Main.openMenu();
                Main.openPage(Routes.TEXTS);
            } else {
                Main.mainWindow.webContents.send(ipcEvents.LOGIN_FAILED);
                ipcMain.emit(ipcEvents.LOGIN_FAILED);
            }
        }, (error) => console.dir(error));
    }

    private static signup(event, arg) {
        const userService = new Services.UserService();

        userService.signup(arg.username, arg.password, arg.email).subscribe((success: boolean) => {
            Main.openPage(Routes.LOGIN);
        }, (error) => console.dir(error));
    }
}

function wrapFn(fn: () => void): string {
    return `(${fn.toString()})()`;
}
