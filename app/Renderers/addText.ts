import * as $ from 'jquery';
import * as Services from '../Services/namespace';

$('#addText').click(addText);
const {ipcRenderer} = require('electron');

function addText(): void {
    const text = $('#text').val();
    const title = $('#title').val();

    // const textService = new Services.TextService();
    // textService.saveText(text, title, '1', '1').subscribe(savedText => {
    //     ipcRenderer.send('main-open-text', savedText._id);
    // });
}
