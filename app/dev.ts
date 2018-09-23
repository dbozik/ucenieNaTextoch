import * as Services from '../app/Services/namespace';

console.log('im in');

const words = Services.parseTextService.splitToParts('pokus jedna. pokus dva? alebo toto.');

console.dir(words);
