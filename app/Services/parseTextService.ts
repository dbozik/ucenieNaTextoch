import { Text, TextPart, WordObject } from '../Objects';
import { StateService } from './stateService';

export class ParseTextService {
    private wordSeparatorsRegex: RegExp;
    private sentenceSeparatorsRegex: RegExp;

    public constructor(private wordSeparators: string, private sentenceSeparators: string) {
        this.wordSeparatorsRegex = new RegExp(`[\\n${wordSeparators.replace(']', '\\]')}]+`);
        this.sentenceSeparatorsRegex = new RegExp(`[\\n${sentenceSeparators.replace(']', '\\]')}]+`);
    }

    public splitToWords(text: string): string[] {
        return this.splitToWordsCase(text)
            .map(word => word.toLowerCase());
    }

    public splitToSentences(text: string): string[] {
        return text.split(this.sentenceSeparatorsRegex)
            .filter(sentence => sentence !== '');
    }

    public splitToParts(text: string): TextPart[] {
        const justWords = this.splitToWordsCase(text);
        const textParts: TextPart[] = [];

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


    public extractWords(textParts: TextPart[]): string[] {
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


    public getWords(text: Text): WordObject[] {
        const wordObjects: WordObject[] = [];

        const userId = StateService.getInstance().userId;

        this.sentencesFromText(text).forEach(sentence => {
            this.wordsFromSentence(sentence).forEach(word => {
                wordObjects.push({
                    word,
                    exampleSentence: sentence,
                    languageId: text.languageId,
                    userId,
                    level: 0,
                });
            });
        });

        return this.uniqBy(wordObjects, 'word');
    }


    private splitToWordsCase(text: string): string[] {
        return text.split(this.wordSeparatorsRegex)
            .filter(word => word !== '');
    }


    private uniqBy(array: any[], key: string): any[] {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }


    private sentencesFromText(text: Text): string[] {
        return text.text.split(this.sentenceSeparatorsRegex)
            .filter(sentence => sentence !== '');
    }


    private wordsFromSentence(sentence: string): string[] {
        return sentence.split(this.wordSeparatorsRegex)
            .filter(word => word !== '')
            .map(word => word.toLowerCase());
    }
}
