"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./database");
var rxjs_1 = require("rxjs");
var texts = /** @class */ (function () {
    function texts() {
        this.db = new database_1.database();
    }
    texts.prototype.addText = function (text, userId, languageId) {
        var textSource$ = new rxjs_1.ReplaySubject(1);
        this.db.texts.insert({ id: 1, userId: userId, languageId: languageId, text: text }, function (error, dbText) {
            textSource$.next(dbText);
        });
        return textSource$.asObservable();
    };
    return texts;
}());
exports.texts = texts;
//# sourceMappingURL=texts.js.map