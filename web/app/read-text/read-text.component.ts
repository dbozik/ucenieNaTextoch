import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TextService } from '../services/text.service';
import { Text } from '../../../app/Objects';

@Component({
    selector: 'app-read-text',
    templateUrl: './read-text.component.html',
    styleUrls: ['./read-text.component.scss'],
    providers: [TextService],
})
export class ReadTextComponent implements OnInit {
    public text: Text;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly textService: TextService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        const textId = this.route.snapshot.params.id;

        this.textService.get(textId).subscribe((result: Text) => {
            this.text = result;
            this.changeDetectorRef.detectChanges();
        });
    }


    public translateLink(): string {
        return 'https://translate.google.com/?sl=de&tl=en#de/en/jemandem';
    }

}
