import { Observable } from 'rxjs';
import { TextPart, Word } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Words {
    private db: Database = new Database();

    public constructor() {
    }

    public add(word: string, exampleSentence: string)
        : Observable<Word> {
        const newWord: Word = {
            ...StateService.getInstance().userLanguageRequest,
            content: word,
            exampleSentence,
            level: 0,
        };
        return this.db.words.insert$(newWord);
    }


    public saveMultiple(words: Word[]): Observable<Word[]> {
        return this.db.words.insert$(words);
    }


    public get(word: string): Observable<Word> {
        return this.db.words.findOne$({content: word});
    }

    public getById(id: string): Observable<Word> {
        return this.db.words.findOne$({_id: id});
    }


    public getList(words: string[]): Observable<Word[]> {
        return this.db.words.find$({...StateService.getInstance().userLanguageRequest, content: {$in: words}});
    }

    public getByLanguage(): Observable<Word[]> {
        const userId = StateService.getInstance().userId;
        const languageId = StateService.getInstance().language._id;

        return this.db.words.find$({userId, languageId});
    }


    public edit(word: Word): Observable<Word> {
        return this.db.words.update$(
            {_id: word._id},
            {
                $set: {
                    content: word.content.toLowerCase(),
                    level: word.level,
                    languageId: word.languageId,
                    translation: word.translation,
                    exampleSentence: word.exampleSentence,
                    exampleSentenceTranslation: word.exampleSentenceTranslation,
                }
            });
    }
}
