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

const getData = () => {
    textsService.getList().subscribe(texts => {
        app.texts = texts;
    });
}

const getArchivedTexts = () => {
    textsService.getArchivedList().subscribe(texts => {
        app.texts = texts.sort((text1, text2) => text1.createdOn > text2.createdOn ? -1 : 
            text1.createdOn < text2.createdOn ? 1 : 0
        );
    });

}

getData();

const { ipcRenderer } = require('electron');

app.textClick = (id) => {
    ipcRenderer.send('main-open-text', id);
}

app.archive = (id) => {
    textsService.archive(id).subscribe(() => {
        setTimeout(() => getData(), 1000);
    });
}

app.getRegularTexts = () => {
    getData();
}

app.getArchivedTexts = () => {
    getArchivedTexts();
}
