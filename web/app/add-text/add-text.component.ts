import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-text',
  templateUrl: './add-text.component.html',
  styleUrls: ['./add-text.component.scss']
})
export class AddTextComponent implements OnInit {

  public value: number = -2;

  constructor(
    public readonly appService: AppService,
    public router: Router,
  ) { }

  ngOnInit() {
    console.dir(this.appService);
    console.log('count');
    
    
    this.appService.value = Math.random();
    this.value = this.appService.value;
  }


  public mojaMetoda() {
    this.router.navigateByUrl('');
  }

}
