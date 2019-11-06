export class Word {
    public _id?: string;
    public content: string;
    public translation?: string;
    public pronounciation?: string;
    public level: number;
    public exampleSentence: string;
    public exampleSentenceTranslation?: string;
    public languageId: string;
    public userId: string;

    public selectionsIds?: string[];

    public constructor() {
    }
}
