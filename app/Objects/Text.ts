import { TextPart, Word } from '.';
import { colorMaxLevel } from '../../web/app/color.utils';

export class Text {
    // text
    public text: string;

    // properties:
    // title
    public title: string;
    // language
    public languageId: string;
    public languageDictionary?: string;

    public userId?: string;
    // word list
    public words?: Word[];
    // parsed text
    // sentences list
    public sentences?: string[];

    public _id?: string;
    public createdOn?: Date;
    public textParts?: TextPart[];

    public percentageUnknown?: number;
    public percentageLearning?: number;
    public unsavedWords?: string[];

    constructor() {
    }

    public static getPercentageUnknown(text: Text): number {
        return this.getPercentage(text, (word: Word) => word.level === 0 ? 1 : 0);
    }


    public static getPercentageLearning(text: Text): number {
        return this.getPercentage(text, (word: Word) => word.level > 0 && word.level < colorMaxLevel * 0.99 ? 1 : 0);
    }


    private static getPercentage(text: Text, condition: (word: Word) => number): number {
        const words = text.textParts
            .filter((textPart: TextPart) => textPart.type === 'word')
            .map((textPart: TextPart) => textPart.word);

        return words.reduce((acc: number, currentElement: Word) =>
            currentElement ? acc + condition(currentElement) : acc,
            0) / words.length;
    }
}
