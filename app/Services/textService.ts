import * as DA from "../DA/namespace";

export class textService {
    constructor() { }

    saveText(text: string, userId: number, languageId: number): number {
        var texts = new DA.texts();
        texts.addText(text, userId, languageId);

        return texts.textId;
    }
}
