import * as Datastore from 'nedb';
import * as path from 'path';

export class database {
    public get words(): Datastore {
        return new Datastore({
            filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
            autoload: true
        });
    }

    public get texts(): Datastore {
        return new Datastore({
            filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
            autoload: true
        });
    }
}