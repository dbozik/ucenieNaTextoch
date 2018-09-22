"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const rxjs_1 = require("rxjs");
class texts {
    constructor() {
        this.db = new database_1.database();
    }
    addText(text, userId, languageId) {
        const textSource$ = new rxjs_1.ReplaySubject(1);
        this.db.texts.insert({ id: 1, userId: userId, languageId: languageId, text: text }, (error, dbText) => {
            textSource$.next(dbText);
        });
        return textSource$.asObservable();
    }
}
exports.texts = texts;
//# sourceMappingURL=texts.js.map