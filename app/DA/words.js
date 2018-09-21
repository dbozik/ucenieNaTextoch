"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var database_1 = require("./database");
var words = /** @class */ (function () {
    function words() {
        this.db = new database_1.database();
    }
    words.prototype.add = function (word, exampleSentence, languageId) {
        if (languageId === void 0) { languageId = 1; }
        var wordSource$ = new rxjs_1.ReplaySubject(1);
        var newWord = {
            word: word,
            exampleSentence: exampleSentence,
            level: 0,
            languageId: languageId,
        };
        this.db.words.insert(newWord, function (error, dbWord) {
            wordSource$.next(dbWord);
        });
        return wordSource$.asObservable();
    };
    words.prototype.get = function (word) {
        var wordSource$ = new rxjs_1.ReplaySubject(1);
        this.db.words.findOne({ word: word }, function (error, foundWord) {
            wordSource$.next(foundWord);
        });
        return wordSource$.asObservable();
    };
    words.prototype.getById = function (id) {
        var wordSource$ = new rxjs_1.ReplaySubject(1);
        this.db.words.findOne({ _id: id }, function (error, foundWord) {
            wordSource$.next(foundWord);
        });
        return wordSource$.asObservable();
    };
    return words;
}());
exports.words = words;
//# sourceMappingURL=words.js.map