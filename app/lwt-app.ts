import { App, BrowserWindow } from 'electron';
import { Routes } from '../web/shared/routes.enum';
import { Navigation } from './navigation';

export class LwtApp {
    private static _lwtApp: LwtApp = null;

    public mainWindow: BrowserWindow;
    private navigation: Navigation;

    constructor(
        private app: App,
        private browserWindow: typeof BrowserWindow,
    ) {
    }


    public static getInstance(): LwtApp {
        return LwtApp._lwtApp;
    }


    public init() {
        this.navigation = new Navigation();

        this.app.on('window-all-closed', this.onWindowAllClosed);
        this.app.on('ready', this.onReady);
        this.app.on('activate', this.onReady);

        LwtApp._lwtApp = this;
    }


    private onWindowAllClosed = () => {
        if (process.platform !== 'darwin') {
            this.app.quit();
        }
    }


    private onClose() {
        // Dereference the window object.
        this.mainWindow = null;
    }


    private onReady = () => {
        this.navigation.closeMenu();

        this.mainWindow = new this.browserWindow({
            width: 1500, 
            height: 927, 
            icon: './web/favicon.ico',
        });

        const environment: 'dev' | 'prod' = process.env.NODE_ENV.trim() as 'dev' | 'prod';

        this.mainWindow.loadFile('./dist/web/index.html');
        if (environment !== 'prod') {
            this.mainWindow.webContents.openDevTools();
        }

        this.mainWindow.on('closed', this.onClose);
    }
}
