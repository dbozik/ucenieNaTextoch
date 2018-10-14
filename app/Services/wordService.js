"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DA = require("../DA/namespace");
const rxjs_1 = require("rxjs");
class wordService {
    constructor() {
        this.wordsDA = new DA.words();
    }
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
    updateTranslation(id, translation) {
        this.wordsDA.updateTranslation(id, translation);
    }
    updateLevel(id, level) {
        this.wordsDA.updateLevel(id, level);
    }
}
exports.wordService = wordService;
//# sourceMappingURL=wordService.js.map