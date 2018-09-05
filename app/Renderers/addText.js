"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Services = require("../Services/namespace");
var $ = require("jquery");
var path_1 = require("path");
var url_1 = require("url");
$('#addText').click(addText);
function addText() {
    var text = $('#text').val();
    console.log(text);
    var textService = new Services.textService();
    textService.saveText(text, 1, 1);
    require('electron').remote.getCurrentWindow().loadURL(url_1.format({
        pathname: path_1.join(__dirname, '../Views/readText.html'),
        protocol: 'file:'
    }));
}
//# sourceMappingURL=addText.js.map