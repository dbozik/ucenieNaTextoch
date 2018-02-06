var texts_1 = require("../DA/texts");
var services;
(function (services) {
    var textService = (function () {
        function textService() {
        }
        textService.prototype.saveText = function (text, userId, languageId) {
            var texts = new texts_1.DA.texts();
            texts.addText(text, userId, languageId);
            return texts.textId;
        };
        return textService;
    })();
    services.textService = textService;
})(services = exports.services || (exports.services = {}));
//# sourceMappingURL=textService.js.map