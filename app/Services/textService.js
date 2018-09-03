"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DA = require("../DA/namespace");
var textService = /** @class */ (function () {
    function textService() {
    }
    textService.prototype.saveText = function (text, userId, languageId) {
        var texts = new DA.texts();
        texts.addText(text, userId, languageId);
        return texts.textId;
    };
    return textService;
}());
exports.textService = textService;
//# sourceMappingURL=textService.js.map