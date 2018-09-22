"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datastore = require("nedb");
const path = require("path");
class database {
    constructor() {
        this._words = null;
        this._texts = null;
    }
    get words() {
        if (!this._words) {
            this._words = new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
                autoload: true
            });
        }
        return this._words;
    }
    get texts() {
        if (!this._texts) {
            this._texts = new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
                autoload: true
            });
        }
        return this._texts;
    }
}
exports.database = database;
//# sourceMappingURL=database.js.map