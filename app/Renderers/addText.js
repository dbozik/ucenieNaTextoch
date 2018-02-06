var textService_1 = require("../Services/textService");
var $ = require('jquery');
//import {textService} from '../Services/textService';
$('#addText').click(addText);
function addText() {
    var text = $('#text').val();
    var textService = new textService_1.services.textService();
    textService.saveText(text, 1, 1);
}
//# sourceMappingURL=addText.js.map