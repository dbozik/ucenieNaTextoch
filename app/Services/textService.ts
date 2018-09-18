import * as DA from "../DA/namespace";

export class textService {
    constructor() { }

    saveText(text: string, userId: number, languageId: number): number {
        const texts = new DA.texts();
        texts.addText(text, userId, languageId);

        return texts.textId;
    }
}
