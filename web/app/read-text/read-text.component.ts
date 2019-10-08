import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-read-text',
    templateUrl: './read-text.component.html',
    styleUrls: ['./read-text.component.scss'],
    providers: [TextService],
})
export class ReadTextComponent implements OnInit {

    constructor(
        private readonly route: ActivatedRoute,
        private readonly textService: TextService,
    ) {
    }

    ngOnInit() {
        console.log('read text');
        console.dir(this.route.snapshot.params);
        const textId = this.route.snapshot.params.id;

        this.textService.get(textId).subscribe((result) => {
            console.log('from main');
            console.dir(result);
        });
    }

}
