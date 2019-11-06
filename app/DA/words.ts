import { Observable } from 'rxjs';
import { colorMaxLevel } from '../../web/app/color.utils';
import { Word, WordsSearch } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Words {
    private db: Database = new Database();

    public constructor() {
    }


    private static filterRequest(input: WordsSearch) {
        const request: Partial<WordsSearch & Word> = {};

        if (input.word) {
            request.content = new RegExp(input.word) as any;
        }
        const levelRequest: any = {};
        if (input.levelFrom || input.levelFrom === 0) {
            levelRequest.$gte = input.levelFrom * colorMaxLevel / 100;
        }
        if (input.levelTo || input.levelTo === 0) {
            levelRequest.$lte = input.levelTo * colorMaxLevel / 100;
        }
        if (levelRequest) {
            request.level = levelRequest;
        }

        return request;
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
        const userId = StateService.getInstance().userId;
        const languageId = StateService.getInstance().language._id;
        words = words.map((word: Word) => ({...word, userId, languageId}));

        return this.db.words.insert$(words);
    }


    public get(word: string): Observable<Word> {
        return this.db.words.findOne$({content: word});
    }


    public getById(id: string): Observable<Word> {
        return this.db.words.findOne$({_id: id});
    }


    public getList(words: string[]): Observable<Word[]>;
    public getList(filter: WordsSearch): Observable<Word[]>;
    public getList(input: any): Observable<Word[]> {
        let request: Partial<WordsSearch & Word & { userId: string, languageId: string }> = {
            ...StateService.getInstance().userLanguageRequest
        };

        if (input instanceof WordsSearch) {
            request = {...request, ...Words.filterRequest(input)};
        } else {
            request.content = {$in: input} as any;
        }

        return this.db.words.find$(request);

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
                    pronounciation: word.pronounciation,
                    exampleSentence: word.exampleSentence,
                    exampleSentenceTranslation: word.exampleSentenceTranslation,
                }
            });
    }
}
