import * as Objects from '.';

export class Text {
    // text
    public text: string;

    // properties:
    // title
    public title: string;
    // language
    public languageId: string;

    public userId?: string;
    // word list
    public words?: Objects.WordObject[];
    // parsed text
    // sentences list
    public sentences?: string[];

    public _id?: string;
    public createdOn?: Date;
    public textParts?: Objects.TextPart[];

    constructor() {
    }
}
