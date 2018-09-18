"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Datastore = require("nedb");
var rxjs_1 = require("rxjs");
var words = /** @class */ (function () {
    function words() {
    }
    words.prototype.add = function (word, exampleSentence) {
        var wordSource = new rxjs_1.ReplaySubject(1);
        var db = { words: null };
        db.words = new Datastore({
            filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
            autoload: true
        });
        var newWord = {
            word: word,
            exampleSentence: exampleSentence,
            level: 0,
            languageId: 1,
        };
        db.words.insert(newWord, function (error, dbWord) {
            wordSource.next(dbWord._id);
        });
        return wordSource.asObservable();
    };
    words.prototype.get = function (word) {
        var wordSource = new rxjs_1.ReplaySubject(1);
        var db = { words: null };
        db.words = new Datastore({
            filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
            autoload: true
        });
        db.words.findOne({ word: word }, function (error, foundWord) {
            wordSource.next(foundWord);
        });
        return wordSource.asObservable();
    };
    return words;
}());
exports.words = words;
//# sourceMappingURL=words.js.map