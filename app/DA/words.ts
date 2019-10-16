import { Observable } from 'rxjs';
import { TextPart, WordObject } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Words {
    private db: Database = new Database();

    public constructor() {
    }

    public add(word: string, exampleSentence: string, languageId: string, userId: string)
        : Observable<WordObject> {
        const newWord: WordObject = {
            word,
            exampleSentence,
            level: 0,
            languageId,
            userId,
        };
        return this.db.words.insert$(newWord);
    }


    public saveMultiple(words: WordObject[]): Observable<WordObject[]> {
        return this.db.words.insert$(words);
    }


    public get(word: string): Observable<WordObject> {
        return this.db.words.findOne$({word});
    }

    public getById(id: string): Observable<WordObject> {
        return this.db.words.findOne$({_id: id});
    }


    public getList(words: string[], languageId: string): Observable<WordObject[]> {
        const userId = StateService.getInstance().userId;

        return this.db.words.find$({word: {$in: words}, userId, languageId});
    }

    public getByLanguage(): Observable<WordObject[]> {
        const userId = StateService.getInstance().userId;
        const languageId = StateService.getInstance().language._id;

        return this.db.words.find$({userId, languageId});
    }


    public edit(word: TextPart): Observable<WordObject> {
        return this.db.words.update$(
            {_id: word.wordId},
            {
                $set: {
                    word: word.content,
                    level: word.level,
                    translation: word.translation,
                    exampleSentence: word.exampleSentence,
                    exampleSentenceTranslation: word.exampleSentenceTranslation,
                }
            });
    }
}
