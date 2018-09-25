// import vue from 'vue';

// const component = vue.extend({
//     el: '#readTextVue',
//     data: {
//         msg: 'message',
//     },
// });

declare const Vue;

var app = new Vue({
    el: '#readTextVue',
    data: {
      message: 'Read text!'
    }
});