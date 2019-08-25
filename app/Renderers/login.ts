import { ipcMain, ipcRenderer } from "electron";

declare const Vue;

var app = new Vue({
    el: '#loginVue',
    data: {
        name: '',
        password: '',
        email: '',
    },
    methods: {
        login: function() {
            ipcRenderer.emit('lwt-login', {name: this.name, password: this.password, email: this.email});
        },
        forgottenPassword: function() {
            ipcRenderer.emit('lwt-open-forgotten-password', {});
        },
        register: function() {
            ipcRenderer.emit('lwt-open-register', {});
        }
    },
});
