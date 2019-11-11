import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'electron';
import { ipcEvents } from '../web/shared/ipc-events.enum';
import { Routes } from '../web/shared/routes.enum';
import { LwtApp } from './lwt-app';
import Main from './Main';

interface AngularWindow extends Window {
    router: Router;
    ngZone: NgZone;
}

declare var window: AngularWindow;

export class Navigation {
    private mainMenu = [
        {
            label: 'Add Text!',
            click: () => {
                this.openPage([Routes.ADD_TEXT]);
            },
        },
        {
            label: 'Texts',
            click: () => {
                this.openPage([Routes.TEXTS]);
            },
        },
        {
            label: 'Vocabulary',
            click: () => {
                this.openPage([Routes.WORDS]);
            },
        },
        {
            label: 'Settings',
            click: () => {
                this.openPage([Routes.SETTINGS]);
            },
        },
        {
            label: 'Signout',
            click: () => {
                this.closeMenu();
                LwtApp.getInstance().mainWindow.webContents.send(ipcEvents.LOGGED_OUT);
                this.openPage([Routes.LOGIN]);
            },
        }
    ];


    public openPage(page: string[]): void {
        LwtApp.getInstance().mainWindow.webContents.send(ipcEvents.ROUTING, page);
    }


    public openMenu() {
        const mainMenu = Menu.buildFromTemplate(this.mainMenu);
        Menu.setApplicationMenu(mainMenu);
    }


    public closeMenu() {
        Menu.setApplicationMenu(null);
    }


    private wrapFn(fn: () => void): string {
        return `(${fn.toString()})()`;
    }
}
