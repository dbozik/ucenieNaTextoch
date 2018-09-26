import {join} from 'path';
import {format} from 'url';
import * as Services from '../Services/namespace';

declare const Vue;

const app = new Vue({
    el: '#textListVue',
    data: {
      message: 'Text list in vue!',
      texts: [],
    }
});

const textsService = new Services.textService();

textsService.getList().subscribe(texts => {
    console.log('texty + reload pokus');
    console.dir(texts);
    app.texts = texts;
});

const { ipcRenderer } = require('electron');

app.textClick = (id) => {
    // require('electron').remote.getCurrentWindow().loadURL(format({
    //     pathname: join(__dirname, `../Views/readText.html?id=${id}`),
    //     protocol: 'file:'
    // }));
    console.log('im sending the id ' + id);
    ipcRenderer.send('main-open-text', id);
    // require('electron').remote.getCurrentWindow()
    //     .loadURL(`file://${__dirname}/app/Views/readText.html?id=${id}`);
}

