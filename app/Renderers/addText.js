"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Services = require("../Services/namespace");
var $ = require("jquery");
$('#addText').click(addText);
function addText() {
    var text = $('#text').val();
    console.log(text);
    var textService = new Services.textService();
    textService.saveText(text, 1, 1);
}
//# sourceMappingURL=addText.js.map