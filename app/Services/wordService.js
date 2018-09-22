"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DA = require("../DA/namespace");
const rxjs_1 = require("rxjs");
class wordService {
    constructor() { }
    getWord(word, exampleSentence) {
        const wordSource$ = new rxjs_1.ReplaySubject(1);
        const words = new DA.words();
        words.get(word).subscribe(retrievedWord => {
            if (retrievedWord) {
                wordSource$.next(retrievedWord);
            }
            else {
                words.add(word, exampleSentence).subscribe(addedWord => {
                    wordSource$.next(addedWord);
                });
            }
        });
        return wordSource$.asObservable();
    }
}
exports.wordService = wordService;
//# sourceMappingURL=wordService.js.map