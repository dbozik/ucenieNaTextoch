"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const database_1 = require("./database");
class words {
    constructor() {
        this.db = new database_1.database();
    }
    add(word, exampleSentence, languageId = 1) {
        const wordSource$ = new rxjs_1.ReplaySubject(1);
        const newWord = {
            word: word,
            exampleSentence: exampleSentence,
            level: 0,
            languageId: languageId,
        };
        this.db.words.insert(newWord, (error, dbWord) => {
            wordSource$.next(dbWord);
        });
        return wordSource$.asObservable();
    }
    get(word) {
        const wordSource$ = new rxjs_1.ReplaySubject(1);
        this.db.words.findOne({ word: word }, (error, foundWord) => {
            wordSource$.next(foundWord);
        });
        return wordSource$.asObservable();
    }
    getById(id) {
        const wordSource$ = new rxjs_1.ReplaySubject(1);
        this.db.words.findOne({ _id: id }, (error, foundWord) => {
            wordSource$.next(foundWord);
        });
        return wordSource$.asObservable();
    }
    updateTranslation(id, translation) {
        const wordSource$ = new rxjs_1.ReplaySubject(1);
        this.db.words.update({ _id: id }, { $set: { translation: translation } }, {});
    }
    updateLevel(id, level) {
        const wordSource$ = new rxjs_1.ReplaySubject(1);
        this.db.words.update({ _id: id }, { $set: { level: level } }, {});
    }
}
exports.words = words;
//# sourceMappingURL=words.js.map