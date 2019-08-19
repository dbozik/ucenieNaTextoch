import { BrowserWindow, Menu, ipcMain } from 'electron';
import { join } from 'path';
import { format, URL } from 'url';
import { userService } from './Services/userService';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import {Database} from 'sqlite3';
// import {Nedb} from 'nedb';
// var Datastore = require('nedb');

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
    // static database: Database;
    private static onWindowAllClosed() {
        if (process.platform !== 'darwin')
            Main.application.quit();
    }

    private static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static loadPage(page: string): void {
        Main.mainWindow.webContents.executeJavaScript(
            wrapFn(() => {
                window.router.navigateByUrl(`/${page}`);
            }),
        );
    }

    private static onReady() {


        // var db:any = new nedb('./file.db');
        // var db = new Datastore({
        //     filename: join(__dirname, 'database.db'),
        //     autoload: true
        // });
        // //let db = new Datastore();

        // Main.database = new Database(':memory:');


        const mainMenuTemplate = [
            {
                label: 'Add Text!',
            },
            {
                label: 'Texts',
                click: () => {
                    // Main.loadPage('texts');
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
                    // Main.loadPage('login');
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

        Main.mainWindow = new Main.BrowserWindow({ width: 800, height: 600 });
        Main.mainWindow.loadURL(`http://localhost:${PORT}/login`);

        Main.mainWindow.webContents.openDevTools();

        Main.mainWindow.on('closed', Main.onClose);
    }

    private static openText(event, arg) {
        Main.mainWindow.loadURL(`http://localhost:${PORT}/readText/${arg}`);
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
        const userService2 = new userService();
        ipcMain.on('lwt-login', userService2.signin);
    }
}

// const {ipcMain} = require('electron');

// Attach listener in the main process with the given ID
// ipcMain.on('main-open-text', (event, arg) => {
//     console.log('im in main-open-text');
//     console.log(
//         arg
//     );
// });

function wrapFn(fn: () => void): string {
    return `(${fn.toString()})()`;
}
