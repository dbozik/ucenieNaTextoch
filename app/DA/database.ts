import * as Datastore from 'nedb';
import * as path from 'path';

export class Database {
    private rootPath = './data/';

    private _words: Datastore = null;

    public get words(): Datastore {
        if (!this._words) {
            this._words = new Datastore({
                filename: path.join(this.rootPath, 'words.db'),
                autoload: true
            });
        }

        return this._words;
    }

    private _texts: Datastore = null;

    public get texts(): Datastore {
        if (!this._texts) {
            this._texts = new Datastore({
                filename: path.join(this.rootPath, 'texts.db'),
                autoload: true
            });
        }

        return this._texts;
    }

    private _textsArchived: Datastore = null;

    public get textsArchived(): Datastore {
        if (!this._textsArchived) {
            this._textsArchived = new Datastore({
                filename: path.join(this.rootPath, 'textsArchived.db'),
                autoload: true
            });
        }

        return this._textsArchived;
    }

    private _languages: Datastore = null;

    public get languages(): Datastore {
        if (!this._languages) {
            this._languages = new Datastore({
                filename: path.join(this.rootPath, 'languages.db'),
                autoload: true
            });
        }

        return this._languages;
    }

    private _settings: Datastore = null;

    public get settings(): Datastore {
        if (!this._settings) {
            this._settings = new Datastore({
                filename: path.join(this.rootPath, 'settings.db'),
                autoload: true
            });
        }

        return this._settings;
    }

    private _users: Datastore = null;

    public get users(): Datastore {
        if (!this._users) {
            this._users = new Datastore({
                filename: path.join(this.rootPath, 'users.db'),
                autoload: true
            });
        }

        return this._users;
    }
}
