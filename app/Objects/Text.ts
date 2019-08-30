import * as Objects from './namespace';

export class Text {
    // text
    public text: string;

    // properties:
    // title
    public title: string;
    // language
    public languageId: string;
    // word list
    public words: Objects.WordObject[];
    // parsed text
    // sentences list
    public sentences: string[];

    constructor() {
    }
}
