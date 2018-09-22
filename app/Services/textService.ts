import * as DA from "../DA/namespace";
import { Observable, of, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { TextObject } from "../Objects/TextObject";

export class textService {
    public constructor() { }

    public saveText(text: string, userId: number, languageId: number)
        : Observable<TextObject> {
        const texts = new DA.texts();

        this.parseText(text, userId, languageId);

        return texts.addText(text, userId, languageId);
    }

    private parseText(text: string, userId: number, languageId: number): void {
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
