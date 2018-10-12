import * as Services from '../Services/namespace';
import { TextPart } from '../Objects/TextPart';

// import vue from 'vue';

// const component = vue.extend({
//     el: '#readTextVue',
//     data: {
//         msg: 'message',
//     },
// });

declare const Vue;

const textsService = new Services.textService();
const wordService = new Services.wordService();

var app = new Vue({
    el: '#readTextVue',
    data: {
        message: 'Read text!',
        text: '',
        textParts: [],
        wordObjects: [],
        translateWord: '',
    },
    methods: {
        translateLink: function() {
            return 'https://translate.google.com/?sl=sk&tl=en#sk/en/' + this.translateWord;
        },
        clickWord: function(word: string, $event): void {
            if ($event.target.childNodes.length > 1) {
                $event.target.childNodes[1].classList.toggle('show');
            }
            this.translateWord = word;
        },
        clickPopup: function($event): void {
            $event.target.classList.toggle('show');
        },
        updateTranslation: function(textPart: TextPart, translation: string): void {
            // update the data in textService, with reflection in the renderer
            textsService.updateTranslation(textPart.wordId, translation);
            wordService.updateTranslation(textPart.wordId, translation);
        },
    },
});

const href = window.location.href;
const id = href.split('id=')[1];

textsService.textId = id;

textsService.textParts$.subscribe(textParts => {
    app.textParts = textParts;
    console.dir(app.textParts);
});
textsService.wordObjects$.subscribe(wordObjects => {
    app.wordObjects = wordObjects;
    console.dir(app.wordObjects);
});

function clickWord(word: string): void {
    app.translateWord = word;
}