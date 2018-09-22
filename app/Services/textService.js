"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DA = require("../DA/namespace");
class textService {
    constructor() { }
    saveText(text, userId, languageId) {
        const texts = new DA.texts();
        this.parseText(text, userId, languageId);
        return texts.addText(text, userId, languageId);
    }
    parseText(text, userId, languageId) {
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
    uniqBy(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }
}
exports.textService = textService;
//# sourceMappingURL=textService.js.map