import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public value: number = -1;

  constructor(
    private readonly appService: AppService,
  ) { }

  ngOnInit() {
    this.value = this.appService.value;
  }

}
