import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-read-text',
  templateUrl: './read-text.component.html',
  styleUrls: ['./read-text.component.scss']
})
export class ReadTextComponent implements OnInit {

  constructor(
      private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
      console.log('read text');
      console.dir(this.route.snapshot.params);
  }

}
