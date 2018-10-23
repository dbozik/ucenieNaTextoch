export class Language {
    public _id?: string;
    public name: string;
    public dictionary: string;
    public wordSeparators: RegExp;
    public sentenceSeparators: RegExp;
    public userId: string;
}