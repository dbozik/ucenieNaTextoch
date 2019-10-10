import { TextPart, WordObject } from '../Objects';
import * as Objects from '../Objects';

export class ParseTextService {
    public constructor(private readonly wordSeparators: RegExp) {
    }

    public splitToWords(text: string): string[] {
        return this.splitToWordsCase(text)
            .map(word => word.toLowerCase());
    }

    public splitToSentences(text: string): string[] {
        return text.split(/[.?!]+/)
            .filter(sentence => sentence !== '');
    }

    public splitToParts(text: string): Objects.TextPart[] {
        const justWords = this.splitToWordsCase(text);
        const textParts: Objects.TextPart[] = [];

        // iterate through words
        justWords.forEach(word => {
            // find the index of the first word
            const wordLength = word.length;
            const wordIndex = text.indexOf(word);

            // cut this part and push to textParts
            const beginPart = text.slice(0, wordIndex);
            textParts.push({
                content: beginPart,
                type: 'separator',
                wordId: '',
            });
            text = text.substr(wordIndex);

            // cut the first word and push to textParts
            textParts.push({
                content: word,
                type: 'word',
                wordId: ''
            });
            text = text.substr(wordLength);
        });

        // include the last part
        textParts.push({
            content: text,
            type: 'separator',
            wordId: ''
        });

        return textParts.filter(word => word.content !== '');
    }


    public extractWords(textParts: Objects.TextPart[]): string[] {
        return textParts.filter(textPart => textPart.type === 'word')
            .map(textPart => textPart.content.toLowerCase())
            .filter((word, index, list) => list.indexOf(word) === index);
    }


    public completeTextParts(textParts: TextPart[], wordObjects: WordObject[]): TextPart[] {
        const result: TextPart[] = JSON.parse(JSON.stringify(textParts));

        wordObjects.forEach(wordObject => {
            result.filter(textPart => textPart.content.toLowerCase() === wordObject.word)
                .forEach(textPart => {
                    textPart.wordId = wordObject._id;
                    textPart.translation = wordObject.translation;
                    textPart.level = wordObject.level;
                    textPart.exampleSentence = wordObject.exampleSentence;
                });
        });

        return result;
    }


    private splitToWordsCase(text: string): string[] {
        return text.split(/[\s,.?!;:_()\[\]/\\"-]+/)
            .filter(word => word !== '');
    }
}
