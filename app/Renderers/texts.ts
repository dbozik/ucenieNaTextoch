import {join} from 'path';
import {format} from 'url';
import * as Services from '../Services/namespace';

declare const Vue;

const app = new Vue({
    el: '#textListVue',
    data: {
      texts: [],
    }
});

const textsService = new Services.textService();

textsService.getList().subscribe(texts => {
    app.texts = texts;
});

const { ipcRenderer } = require('electron');

app.textClick = (id) => {
    ipcRenderer.send('main-open-text', id);
}
