"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Services = require("../app/Services/namespace");
console.log('im in');
const words = Services.parseTextService.splitToParts('pokus jedna. pokus dva? alebo toto.');
console.dir(words);
//# sourceMappingURL=dev.js.map