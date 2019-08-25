import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-text',
  templateUrl: './add-text.component.html',
  styleUrls: ['./add-text.component.scss']
})
export class AddTextComponent implements OnInit {

  public value: number = -2;

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
    console.log('count');    
  }


  public mojaMetoda() {
    this.router.navigateByUrl('');
  }

}
