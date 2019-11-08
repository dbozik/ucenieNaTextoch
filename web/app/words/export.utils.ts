import { Word } from '../../../app/Objects';

export class ExportUtils {
    public static exportForMnemosyne(words: Word[]): Blob {
        const DELIMITER = '\t';

        // specify how you want to handle null values here
        const replacer = (key, value) => value === null || typeof value === 'undefined' ? '' : value;

        const jsonProcess = (item: string) => JSON.parse(JSON.stringify(item, replacer));

        const mnemosyneEntries = words.map((word: Word) => [
            jsonProcess(word.exampleSentence).replace(new RegExp(word.content, 'i'),
                `<b>${word.exampleSentence.match(new RegExp(word.content, 'i'))}</b>`),
            jsonProcess(word.pronounciation),
            jsonProcess(word.exampleSentence).replace(new RegExp(word.content, 'i'), `<b>[${word.translation}]</b>`),
        ].join(DELIMITER));
        const mnemosyneArray = mnemosyneEntries.join('\r\n');

        return new Blob(['\ufeff', mnemosyneArray], {type: 'text'});
    }
}
