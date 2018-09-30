import { TextPart } from "./TextPart";

export class TextObject {
    public _id?: string;
    public text: string;
    public languageId: number;
    public userId: number;
    public textParts?: TextPart[];
}