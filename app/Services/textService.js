"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DA = require("../DA/namespace");
var textService = /** @class */ (function () {
    function textService() {
    }
    textService.prototype.saveText = function (text, userId, languageId) {
        var texts = new DA.texts();
        this.parseText(text, userId, languageId);
        return texts.addText(text, userId, languageId);
    };
    textService.prototype.parseText = function (text, userId, languageId) {
        var wordsDA = new DA.words();
        var sentences = text.split(/[.?!]+/)
            .filter(function (sentence) { return sentence !== ""; });
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
        sentences.forEach(function (sentence) {
            var words = sentence.split(/[\s,.?!;:_()\[\]/\\"-]+/)
                .filter(function (word) { return word !== ""; })
                .map(function (word) { return word.toLowerCase(); });
            words.forEach(function (word) {
                wordsDA.get(word).subscribe(function (wordObject) {
                    console.dir(word);
                    console.dir(sentence);
                    console.dir(wordObject);
                    if (!wordObject) {
                        wordsDA.add(word, sentence);
                    }
                });
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
    };
    return textService;
}());
exports.textService = textService;
//# sourceMappingURL=textService.js.map