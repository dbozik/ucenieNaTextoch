import * as Services from '../Services/namespace';

// import vue from 'vue';

// const component = vue.extend({
//     el: '#readTextVue',
//     data: {
//         msg: 'message',
//     },
// });

declare const Vue;

const textsService = new Services.textService();

var app = new Vue({
  el: '#readTextVue',
  data: {
    message: 'Read text!',
    text: '',
    textParts: [],
    translateWord: '',
  },
  methods: {
    loadText: function () {
      console.log(window.location.href);
      const href = window.location.href;
      const id = href.split('id=')[1];
      console.log(id);
    },
    translateLink: function() {
      return 'https://translate.google.com/?sl=sk&tl=en#sk/en/' + this.translateWord;
    },
    clickWord: function(word: string): void {
      this.translateWord = word;
    },
  },
});

const href = window.location.href;
const id = href.split('id=')[1];
console.log(id);

textsService.getText(id).subscribe(text => {
  app.text = text;
  app.textParts = text ? text.textParts : [];
});

function clickWord(word: string): void {
  app.translateWord = word;
}