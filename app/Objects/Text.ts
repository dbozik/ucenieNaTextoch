import * as Objects from './namespace';

export class Text {
    constructor() { }

    // properties:
    // text
    public text: string;
    // title
    public title: string;
    // language
    public languageId: string;
    // parsed text
    // word list
    public words: Objects.WordObject[];
    // sentences list
    public sentences: string[];
}