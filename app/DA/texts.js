"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Datastore = require("nedb");
var texts = /** @class */ (function () {
    function texts() {
    }
    texts.prototype.addText = function (text, userId, languageId) {
        var words = text.split(/[\s,.?!;:_()\[\]/\\"-]+/)
            .filter(function (word) { return word !== ""; });
        var parsedText = [];
        for (var index = 0; index < words.length - 1; index++) {
            parsedText.push(words[index]);
            var beginning = text.indexOf(words[index]) + words[index].length;
            var end = text.indexOf(words[index + 1]);
            var separator = text.substring(beginning, end);
            parsedText.push(separator);
        }
        console.dir(words);
        console.dir(parsedText);
        var db = { texts: null };
        db.texts = new Datastore({
            filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
            autoload: true
        });
        db.texts.insert({ id: 1, userId: userId, languageId: languageId, text: text });
    };
    return texts;
}());
exports.texts = texts;
//# sourceMappingURL=texts.js.map