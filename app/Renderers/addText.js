"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Services = require("../Services/namespace");
const $ = require("jquery");
const path_1 = require("path");
const url_1 = require("url");
$('#addText').click(addText);
function addText() {
    const text = $('#text').val();
    console.log(text);
    const textService = new Services.textService();
    textService.saveText(text, 1, 1);
    require('electron').remote.getCurrentWindow().loadURL(url_1.format({
        pathname: path_1.join(__dirname, '../Views/readText.html'),
        protocol: 'file:'
    }));
}
//# sourceMappingURL=addText.js.map