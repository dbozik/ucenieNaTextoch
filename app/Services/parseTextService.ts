import { Text, TextPart, Word } from '../Objects';
import { StateService } from './stateService';

export class ParseTextService {
    private wordSeparatorsRegex: RegExp;
    private sentenceSeparatorsRegex: RegExp;

    public unsavedWords: Set<string> = new Set<string>();

    public constructor() {
        const language = StateService.getInstance().language;

        this.wordSeparatorsRegex = new RegExp(`[\\n${language.wordSeparators.replace(']', '\\]')}]+`);
        this.sentenceSeparatorsRegex = new RegExp(`[\\n${language.sentenceSeparators.replace(']', '\\]')}]+`);
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
            });
            text = text.substr(wordIndex);

            // cut the first word and push to textParts
            textParts.push({
                content: word,
                type: 'word',
            });
            text = text.substr(wordLength);
        });

        // include the last part
        textParts.push({
            content: text,
            type: 'separator',
        });

        return textParts.filter(word => word.content !== '');
    }


    public extractWords(textParts: TextPart[]): string[] {
        return textParts.filter(textPart => textPart.type === 'word')
            .map(textPart => textPart.content.toLowerCase())
            .filter((word, index, list) => list.indexOf(word) === index);
    }


    public completeTextParts(textParts: TextPart[], wordObjects: Word[]): TextPart[] {
        const result: TextPart[] = JSON.parse(JSON.stringify(textParts));
        const wordObjectsMap = new Map();
        wordObjects.forEach(wordObject => wordObjectsMap.set(wordObject.content, wordObject));

        const textPartsWords = result.filter(textPart => textPart.type === 'word');

        textPartsWords.forEach(textPart => {
            const wordObject = wordObjectsMap.get(textPart.content.toLowerCase());

            if (wordObject) {
                textPart.word = wordObject;
            } else {
                this.unsavedWords.add(textPart.content.toLowerCase());
            }
        });

        return result;
    }


    public getWords(text: Text): Word[] {
        const wordObjects: Word[] = [];

        this.sentencesFromText(text).forEach(sentence => {
            this.wordsFromSentence(sentence).forEach(word => {
                wordObjects.push({
                    content: word.toLowerCase(),
                    exampleSentence: sentence,
                    languageId: text.languageId,
                    userId: StateService.getInstance().userId,
                    level: 0,
                });
            });
        });

        return this.uniqBy(wordObjects, 'content');
    }


    private splitToWordsCase(text: string): string[] {
        return text.split(this.wordSeparatorsRegex)
            .filter(word => word !== '');
    }


    private uniqBy<T>(array: T[], key: keyof T): any[] {
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
