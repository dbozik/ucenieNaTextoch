import { BrowserWindow, Menu, ipcMain } from 'electron';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ipcEvents } from '../web/shared/ipc-events.enum';
import * as Services from '../app/Services/namespace';

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

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin')
            Main.application.quit();
    }

    private static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.closeMenu();

        Main.mainWindow = new Main.BrowserWindow({ width: 800, height: 600 });

        const environment: 'dev' | 'prod' = 'dev';

        if (environment === 'dev') {
            Main.mainWindow.loadURL(`http://localhost:${PORT}/login`);
        } else {
            Main.mainWindow.loadFile('./dist/web/index.html');
        }

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
                    Main.mainWindow.webContents.executeJavaScript(
                        wrapFn(() => {
                            window.ngZone.run(() => {
                                window.router.navigateByUrl(`/texts`);
                            });
                        }),
                    );
                },
            },
            {
                label: 'Vocabulary',
            },
            {
                label: 'Settings'
            },
            {
                label: 'Signout',
                click: () => {
                    Main.closeMenu();
                    Main.mainWindow.webContents.executeJavaScript(
                        wrapFn(() => {
                            window.ngZone.run(() => {
                                window.router.navigateByUrl(`/login`);
                            });
                        }),
                    );
                },
            }
        ];

        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
    }

    private static closeMenu() {
        Menu.setApplicationMenu(null);
    }


    private static openText(event, arg) {
        Main.mainWindow.loadURL(`http://localhost:${PORT}/readText/${arg}`);
    }

    private static login(event, arg) {
        const userService = new Services.userService();
        userService.signin(arg.username, arg.password).subscribe((success: boolean) => {
            if (success) {
                Main.openMenu();
                Main.mainWindow.webContents.executeJavaScript(
                    wrapFn(() => {
                        window.ngZone.run(() => {
                            window.router.navigateByUrl(`/texts`);
                        });
                    }),
                );
            } else {
                Main.mainWindow.webContents.send(ipcEvents.LOGIN_FAILED);
                ipcMain.emit(ipcEvents.LOGIN_FAILED);
            }
        }, (error) => console.dir(error));
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
        ipcMain.on('main-open-text', Main.openText);
        ipcMain.on(ipcEvents.LOGIN, Main.login);
    }
}

function wrapFn(fn: () => void): string {
    return `(${fn.toString()})()`;
}
