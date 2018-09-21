"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Datastore = require("nedb");
var path = require("path");
var database = /** @class */ (function () {
    function database() {
    }
    Object.defineProperty(database.prototype, "words", {
        get: function () {
            return new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
                autoload: true
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(database.prototype, "texts", {
        get: function () {
            return new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
                autoload: true
            });
        },
        enumerable: true,
        configurable: true
    });
    return database;
}());
exports.database = database;
//# sourceMappingURL=database.js.map