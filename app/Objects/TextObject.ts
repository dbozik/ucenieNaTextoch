import { TextPart } from "./TextPart";

export class TextObject {
    public _id?: string;
    public text: string;
    public title: string;
    public languageId: string;
    public userId: string;
    public textParts?: TextPart[];
}