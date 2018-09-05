import {BrowserWindow, Menu} from 'electron';
import {join} from 'path';
import {format, URL} from 'url';
// import {Database} from 'sqlite3';
// import {Nedb} from 'nedb';
// var Datastore = require('nedb');

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
    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({width: 800, height: 600})
        Main.mainWindow.loadURL(format({
            pathname: join(__dirname, 'Views/index.html'),
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
                click(){
                    Main.mainWindow.loadURL(format({
                        pathname: join(__dirname, 'Views/addText.html'),
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

        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
    }
    static main(
        app: Electron.App,
        browserWindow: typeof BrowserWindow){
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