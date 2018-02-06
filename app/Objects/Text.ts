import * as Objects from './namespace';

export class Text {
    constructor() { }

    // properties:
    // text
    public text: string;
    // language
    public languageId: number;
    // parsed text
    // word list
    public words: Objects.WordObject[];
    // sentences list
    public sentences: string[];
}