import { LwtApp } from './lwt-app';
import { BrowserWindow, App } from 'electron';

const app = {
    quit: () => {
    },
    on: (event, fn) => {
    },
};

let lwtApp = new LwtApp(app as App, null);

test('lwtApp: init runs correct on methods', () => {
    const onMethod = jest.spyOn(app, 'on');
    lwtApp.init();

    expect(onMethod).toHaveBeenCalledTimes(3);
});

xtest('lwtApp: onReady event opens index.html', () => {
    lwtApp = new LwtApp({on: (event, fn) => {
            if (event === 'ready') {
                fn();
            }
        }} as App, BrowserWindow);
    lwtApp.mainWindow = {loadFile: (text: string) => {}} as BrowserWindow;

    const loadFile = jest.spyOn(lwtApp.mainWindow, 'loadFile');
    lwtApp.init();

    expect(loadFile).toHaveBeenCalledWith('./dist/web/index.html');
});


