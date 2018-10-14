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
            $event.toElement.parentElement.classList.toggle('show');
        },
        clickStopPropagation: function($event): void {
            $event.stopPropagation();
        },
        updateTranslation: function(textPart: TextPart): void {
            // update the data in textService, with reflection in the renderer
            if (textPart.translation) {
                textsService.updateTranslation(textPart.wordId, textPart.translation);
                wordService.updateTranslation(textPart.wordId, textPart.translation);    
            }
        }
    },
});

const href = window.location.href;
const id = href.split('id=')[1];

textsService.textId = id;

textsService.textParts$.subscribe(textParts => {
    if (textParts.some(textPart => textPart.hasOwnProperty('translation'))) {
        app.textParts = textParts;
    }
});
textsService.wordObjects$.subscribe(wordObjects => {
    app.wordObjects = wordObjects;
});

function clickWord(word: string): void {
    app.translateWord = word;
}