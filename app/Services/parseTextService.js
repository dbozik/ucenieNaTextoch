"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class parseTextService {
    constructor() { }
    static splitToWords(text) {
        return text.split(/[\s,.?!;:_()\[\]/\\"-]+/)
            .filter(word => word !== "")
            .map(word => word.toLowerCase());
    }
    static splitToSentences(text) {
        return text.split(/[.?!]+/)
            .filter(sentence => sentence !== "");
    }
    static split(text) {
        const justWords = parseTextService.splitToWords(text);
        const textParts = [];
        // iterate through words
        justWords.forEach(word => {
            // find the index of the first word
            const wordLength = word.length;
            const wordIndex = text.indexOf(word);
            // cut this part and push to textParts
            const beginPart = text.slice(0, wordIndex);
            textParts.push(beginPart);
            text = text.substr(wordIndex);
            // cut the first word and push to textParts
            textParts.push(word);
            text = text.substr(wordLength);
        });
        // include the last part
        textParts.push(text);
        return textParts.filter(word => word !== '');
    }
}
exports.parseTextService = parseTextService;
//# sourceMappingURL=parseTextService.js.map