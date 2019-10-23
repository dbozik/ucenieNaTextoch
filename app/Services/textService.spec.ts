import * as Objects from '../Objects';
import * as DA from '../DA';
import { TextService } from './textService';
import { of } from 'rxjs';

const text: Objects.Text = {
    text: 'nieco ine, nieco',
    title: 'title',
    languageId: '1',
};

const textParts: Objects.TextPart[] = [
    {
        content: 'nieco',
        type: 'word',
    },
    {
        content: ' ',
        type: 'separator',
    },
    {
        content: 'ine',
        type: 'word',
    },
    {
        content: ', ',
        type: 'separator',
    },
    {
        content: 'nieco',
        type: 'word',
    },
];

const wordObjects: Objects.Word[] = [
    {
        content: 'nieco',
        level: 0,
        exampleSentence: '',
        languageId: '1',
        userId: '1',
    }
];

const textService = new TextService();

test('textService tests work', () => {
    expect(1).toBe(1);
});


test('textService tests mocking', () => {
    const textsDAGet = jest.spyOn((new DA.Texts()), 'get').mockReturnValue(of(text));

    const textId = Math.random().toString();
    // textService.getTextMock(textId).subscribe();

    expect(textsDAGet).toHaveBeenCalledWith(textId);
});

// const getText = jest.spyOn((new DA.Texts()), 'get').mockReturnValue({
//
// });
