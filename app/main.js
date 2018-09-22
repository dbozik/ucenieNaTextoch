"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const url_1 = require("url");
// import {Database} from 'sqlite3';
// import {Nedb} from 'nedb';
// var Datastore = require('nedb');
class Main {
    // static database: Database;
    static onWindowAllClosed() {
        if (process.platform !== 'darwin')
            Main.application.quit();
    }
    static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }
    static onReady() {
        Main.mainWindow = new Main.BrowserWindow({ width: 800, height: 600 });
        Main.mainWindow.loadURL(url_1.format({
            pathname: path_1.join(__dirname, 'Views/index.html'),
            protocol: 'file:'
        }));
        Main.mainWindow.webContents.openDevTools();
        // var db:any = new nedb('./file.db');
        // var db = new Datastore({
        //     filename: join(__dirname, 'database.db'),
        //     autoload: true
        // });
        // //let db = new Datastore();
        // Main.database = new Database(':memory:');
        Main.mainWindow.on('closed', Main.onClose);
        const mainMenuTemplate = [
            {
                label: 'Add Text!',
                click() {
                    Main.mainWindow.loadURL(url_1.format({
                        pathname: path_1.join(__dirname, 'Views/addText.html'),
                        protocol: 'file:'
                    }));
                }
            },
            {
                label: 'Texts'
            },
            {
                label: 'Vocabulary',
            },
            {
                label: 'Settings'
            }
        ];
        const mainMenu = electron_1.Menu.buildFromTemplate(mainMenuTemplate);
        electron_1.Menu.setApplicationMenu(mainMenu);
    }
    static main(app, browserWindow) {
        // we pass the Electron.App object and the 
        // Electron.BrowserWindow into this function
        // so this class1 has no dependencies.  This
        // makes the code easier to write tests for
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onReady);
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map