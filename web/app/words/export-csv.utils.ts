import { Word } from '../../../app/Objects';

export class ExportCsvUtils {
    public static exportToCsv(words: Word[]): Blob {
        const DELIMITER = ';';

        // specify how you want to handle null values here
        const replacer = (key, value) => value === null || typeof value === 'undefined' ? '' : value;

        const header = ['word', 'translate', 'sentence', 'sentenceTranslate'];

        const jsonProcess = (item: string) => JSON.stringify(item, replacer);

        const csv = words.map((word: Word) => [
            jsonProcess(word.content),
            jsonProcess(word.translation),
            jsonProcess(word.exampleSentence),
            jsonProcess(word.exampleSentenceTranslation),
        ].join(DELIMITER));
        csv.unshift(header.join(DELIMITER));
        const csvArray = csv.join('\r\n');

        return new Blob(['\ufeff', csvArray], {type: 'text/csv'});
    }
}
