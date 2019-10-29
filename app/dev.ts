import * as Services from '../app/Services';
import { Database } from './DA/database';

// console.log('im in');

// const words = Services.parseTextService.splitToParts('pokus jedna. pokus dva? alebo toto.');

// console.dir(words);

const languageService = new Services.LanguageService();

// languageService.add('german', 'https://translate.google.com/?sl=de&tl=en#de/en/{word}',
// /[.?!]+/, /[\s,.?!;:_()\[\]/\\"-]+/, '0');

const db: Database = new Database();


// db.texts.insert$({createdOn: (new Date()).getTime(), title: 'test date'}).subscribe();

const query  = {createdOn: {$gte: new Date(2019, 10, 26)}};
console.log('query');
console.dir(query);

db.texts.find(query, (err, doc) => {
    console.log('error');
    console.dir(err);

    console.log('doc');
    console.dir(doc);
});
