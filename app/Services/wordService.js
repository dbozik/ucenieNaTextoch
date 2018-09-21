"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DA = require("../DA/namespace");
var rxjs_1 = require("rxjs");
var wordService = /** @class */ (function () {
    function wordService() {
    }
    wordService.prototype.getWord = function (word, exampleSentence) {
        var wordSource$ = new rxjs_1.ReplaySubject(1);
        var words = new DA.words();
        words.get(word).subscribe(function (retrievedWord) {
            if (retrievedWord) {
                wordSource$.next(retrievedWord);
            }
            else {
                words.add(word, exampleSentence).subscribe(function (addedWord) {
                    wordSource$.next(addedWord);
                });
            }
        });
        return wordSource$.asObservable();
    };
    return wordService;
}());
exports.wordService = wordService;
//# sourceMappingURL=wordService.js.map