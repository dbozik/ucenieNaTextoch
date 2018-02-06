import * as Services from "../Services/Services";
import * as $ from 'jquery';

$('#addText').click(addText);

function addText(): void {
    var text = $('#text').val();
    var textService = new Services.textService();
    textService.saveText(text, 1, 1);
}
