import * as Services from "../Services/namespace";
import * as $ from 'jquery';
import Main from '../main';
import {join} from 'path';
import {format} from 'url';

$('#addText').click(addText);

function addText(): void {
    const text = $('#text').val();
    console.log(text);
    const textService = new Services.textService();
    textService.saveText(text, 1, 1);

    require('electron').remote.getCurrentWindow().loadURL(format({
        pathname: join(__dirname, '../Views/readText.html'),
        protocol: 'file:'
    }));
}
