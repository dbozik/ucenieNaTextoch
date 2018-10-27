import * as Services from '../Services/namespace';
import { TextPart } from '../Objects/TextPart';

const maxLevel = 10000;

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
        title: '',
        textParts: [],
        wordObjects: [],
        translateWord: '',
    },
    methods: {
        translateLink: function() {
            return 'https://translate.google.com/?sl=de&tl=en#de/en/' + this.translateWord;
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
        },
        decreaseLevel: function(textPart: TextPart): void {
            const newLevel = textPart.level / 2;

            wordService.updateLevel(textPart.wordId, newLevel);
            textsService.updateLevel(textPart.wordId, newLevel);
        },
        increaseLevel: function(textPart: TextPart): void {
            const newLevel = textPart.level / 2 + maxLevel / 2;

            wordService.updateLevel(textPart.wordId, newLevel);
            textsService.updateLevel(textPart.wordId, newLevel);
        },
        getColor: function(level: number): object {
            if (typeof level === 'undefined') {
                return {};
            }
            if (level === 0) {
                return {
                    backgroundColor: 'rgb(150, 150, 150)',
                };
            }
            const constantColor = 255;
            const linearColor = Math.ceil(255 * level / maxLevel);
            const quadraticColor = Math.ceil(255 * level * level / maxLevel / maxLevel);

            return {
                backgroundColor: `rgb(${constantColor}, ${linearColor}, ${quadraticColor})`,
            };
        }
    },
});

const href = window.location.href;
const id = href.split('id=')[1];

textsService.textId = id;

textsService.text$.subscribe(text => {
    app.title = text.title;
    app.text = text.text;
});

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