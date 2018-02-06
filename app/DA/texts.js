var path = require('path');
var Datastore = require('nedb');
var DA;
(function (DA) {
    var texts = (function () {
        function texts() {
        }
        texts.prototype.addText = function (text, userId, languageId) {
            var db = {};
            db.texts = new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
                autoload: true
            });
            db.texts.insert({ id: 1, userId: userId, languageId: languageId, text: text });
        };
        return texts;
    })();
    DA.texts = texts;
})(DA = exports.DA || (exports.DA = {}));
//# sourceMappingURL=texts.js.map