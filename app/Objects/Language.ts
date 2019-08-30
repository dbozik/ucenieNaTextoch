export class Language {
    public _id?: string;
    public name: string;
    public dictionary: string;
    public wordSeparators: RegExp | string;
    public sentenceSeparators: RegExp | string;
    public userId?: string;
}
