import { Word } from './Word';

export class TextPart {
    public content: string;
    public type: 'word' | 'separator';

    public word?: Word;
    public selections?: Word[];

    public color?: string;
    public title?: string;
}
