import * as DA from "../DA/namespace";
import { Observable, of, from, forkJoin, BehaviorSubject, combineLatest } from "rxjs";
import { switchMap, tap, map, takeUntil, first } from "rxjs/operators";
import { TextObject } from "../Objects/TextObject";
import { parseTextService } from "./parseTextService";
import { WordObject, TextPart } from "../Objects/namespace";

export class textService {

    private textsDA = new DA.texts();
    private wordsDA = new DA.words();

    private _textId: string;
    private textPartsSource$: BehaviorSubject<TextPart[]> = new BehaviorSubject([]);
    private wordObjectsSource$: BehaviorSubject<WordObject[]> = new BehaviorSubject([]);

    public textParts$: Observable<TextPart[]> = this.textPartsSource$.asObservable();
    public wordObjects$: Observable<WordObject[]> = this.wordObjectsSource$.asObservable();

    public set textId(textId: string) {
        this._textId = textId;

        // get textParts
        this.textsDA.get(this._textId).subscribe(textDA => {
            const textParts = parseTextService.splitToParts(textDA.text);

            this.textPartsSource$.next(textParts);
        });

        // get wordObjects
        this.textParts$.subscribe(textParts => {
            const words = textParts.filter(textPart => textPart.type === 'word')
                .map(textPart => textPart.content.toLowerCase())
                .filter((word, index, list) => list.indexOf(word) === index);

            const wordObjects: WordObject[] = [];
            const getWordObjects$: Observable<WordObject>[] = [];

            words.forEach(word => {
                const getWordObject$ = this.wordsDA.get(word).pipe(
                    tap(wordObject => wordObjects.push(wordObject))
                );
                getWordObjects$.push(getWordObject$);
            });

            combineLatest(getWordObjects$).subscribe(() =>
                this.wordObjectsSource$.next(wordObjects)
            );
        });

        // append wordIds to textParts
        combineLatest(this.wordObjects$, this.textParts$).pipe(
            first(([wordObjects, textParts]: [WordObject[], TextPart[]]) => {
                return wordObjects.length > 0 && textParts.length > 0;
            })
        )
            .subscribe(
                ([wordObjects, textParts]: [WordObject[], TextPart[]]) => {
                    wordObjects.forEach(wordObject => {
                        textParts.filter(textPart =>
                            textPart.content.toLowerCase() === wordObject.word)
                            .forEach(textPart => {
                                textPart.wordId = wordObject._id;
                                textPart.word = wordObject.word;
                                textPart.translation = wordObject.translation;
                                textPart.level = wordObject.level;
                                textPart.exampleSentence = wordObject.exampleSentence;
                            });
                    });
                    this.textPartsSource$.next(textParts);
                });
    }

    public constructor() { }

    public getList(): Observable<TextObject[]> {
        const texts = new DA.texts();

        return texts.getList();
    }

    public saveText(text: string, userId: number, languageId: number)
        : Observable<TextObject> {
        const texts = new DA.texts();

        this.saveWords(text, userId, languageId);

        return texts.addText(text, userId, languageId);
    }

    public parseText(text: string, userId: number, languageId: number): any {
        const wordsDA = new DA.words();

        const words = parseTextService.splitToWords(text);
        const textParts = parseTextService.splitToParts(text);

        const wordObjects: WordObject[] = [];
        const getWords$: Observable<WordObject>[] = [];

        words.forEach(word => {
            const getWord$ = wordsDA.get(word).pipe(
                tap(wordObject => wordObjects.push(wordObject)),
            );

            getWords$.push(getWord$);
        });

        forkJoin(getWords$).subscribe(() => {

        });
    }

    private saveWords(text: string, userId: number, languageId: number): void {
        const wordsDA = new DA.words();

        const sentences = text.split(/[.?!]+/)
            .filter(sentence => sentence !== "");

        // from(sentences).pipe(
        //     switchMap(sentence => {
        //         const words = sentence.split(/[\s,.?!;:_()\[\]/\\"-]+/)
        //             .filter(word => word !== "")
        //             .map(word => word.toLowerCase());

        //         return from(words.map(word => {
        //             return {word: word, exampleSentence: sentence};
        //         }));
        //     }),
        //     switchMap(wordObject => {
        //         return {
        //             word: wordsDA.get(wordObject.word), 
        //             exampleSentence: wordObject.exampleSentence,
        //         }
        //     }),
        //     switchMap(wordObject => {
        //         if (!wordObject.word)
        //     })
        // )

        // sentences.forEach(sentence => {
        //     const words = sentence.split(/[\s,.?!;:_()\[\]/\\"-]+/)
        //         .filter(word => word !== "")
        //         .map(word => word.toLowerCase());

        //     words.forEach(word => {
        //         wordsDA.get(word).subscribe(wordObject => {
        //             if (!wordObject) {
        //                 wordsDA.add(word, sentence);
        //             }
        //         });
        //     });
        // });

        let wordObjects = [];

        sentences.forEach(sentence => {
            const words = sentence.split(/[\s,.?!;:_()\[\]/\\"-]+/)
                .filter(word => word !== "")
                .map(word => word.toLowerCase());

            words.forEach(word => {
                wordObjects.push({
                    word: word,
                    sentence: sentence,
                });
            });
        });

        wordObjects = this.uniqBy(wordObjects, 'word');

        wordObjects.forEach(wordObject => {
            wordsDA.get(wordObject.word).subscribe(wordObjectDb => {
                if (!wordObjectDb) {
                    wordsDA.add(wordObject.word, wordObject.sentence);
                }
            });
        });

        // const parsedText: string[] = [];

        // for (let index = 0; index < words.length - 1; index++) {
        //     parsedText.push(words[index]);
        //     const beginning = text.indexOf(words[index]) + words[index].length;
        //     const end = text.indexOf(words[index + 1]);
        //     const separator = text.substring(beginning, end);
        //     parsedText.push(separator);
        // }
    }

    private uniqBy(array: any[], key: string): any[] {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }
}
