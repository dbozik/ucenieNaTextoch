import { TextPart, WordObject } from "../Objects";
import * as Objects from '../Objects';

export class ParseTextService {
    public constructor() {
    }

    public static splitToWords(text: string): string[] {
        return this.splitToWordsCase(text)
            .map(word => word.toLowerCase());
    }

    public static splitToSentences(text: string): string[] {
        return text.split(/[.?!]+/)
            .filter(sentence => sentence !== '');
    }

    public static splitToParts(text: string): Objects.TextPart[] {
        const justWords = ParseTextService.splitToWordsCase(text);
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


    public static extractWords(textParts: Objects.TextPart[]): string[] {
        return textParts.filter(textPart => textPart.type === 'word')
            .map(textPart => textPart.content.toLowerCase())
            .filter((word, index, list) => list.indexOf(word) === index);
    }


    public static completeTextParts(textParts: TextPart[], wordObjects: WordObject[]): TextPart[] {
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


    private static splitToWordsCase(text: string): string[] {
        return text.split(/[\s,.?!;:_()\[\]/\\"-]+/)
            .filter(word => word !== '');
    }

    // class text

    // properties:
    // text
    // language
    // parsed text
    // word list
    // sentences list

    /////////////////////////////////////////////////////////
    // method to split the text
    // arguments are none

    // get sentence separators
    //
    // get word separators from the language settings
    // split the text by the visible and hidden separators
    // save the result of words and symbols to parsed text

    //////////////////////////////////////////////////////////
    // method to get vocabulary returns a list of word objects
    // arguments are the text, the language and settings

    //  take the parsed text
    //  get the distinct, lowercase words
    //  for every word
    // find the word object in database (word, languageId, userId)
    // add the word object to translated words array

    //////////////////////////////////////////////////////////////
    // method to translate parsed text

    // for every element in parsed text
    // if it is a symbol, skip
    // if it is a word
    // find in vocabulary list
    // if it exists
    // fill in parsed text its id
    // if it does not exist
    // create a new word object
    // set word
    // translation = void
    // level = unknown
    // sentence = get sentence
    // add the word object to vocabulary list

    ///////////////////////////////////////////////////////////
    // method to parse text
    // arguments are the text, the language, the settings

    // initialize the class properties
    // call the split the text function
    // call the vocabulary function
    // call the translate parsed text function


    // class settings
    // properties:
    // user
    // list of languages
    // dictionary
    // word separators
    // hidden word separators
    // sentence separators
}
