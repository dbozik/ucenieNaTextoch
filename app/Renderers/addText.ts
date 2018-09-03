import * as Services from "../Services/namespace";
import * as $ from 'jquery';

$('#addText').click(addText);

function addText(): void {
    const text = $('#text').val();
    console.log(text);
    const textService = new Services.textService();
    textService.saveText(text, 1, 1);
}
