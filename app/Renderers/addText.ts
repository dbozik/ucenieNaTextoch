import * as Services from "../Services/namespace";
import * as $ from 'jquery';
import Main from '../main';
import {join} from 'path';
import {format} from 'url';

$('#addText').click(addText);
const { ipcRenderer } = require('electron');

function addText(): void {
    const text = $('#text').val();
    console.log(text);
    const textService = new Services.textService();
    textService.saveText(text, 1, 1).subscribe(savedText => {
        ipcRenderer.send('main-open-text', savedText._id);
    });
}
