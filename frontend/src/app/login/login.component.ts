import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  private emailErrMsg: String = "";
  private passErrMsg: String = "";
  private errMsg: String = "";
  
  constructor(private http: HttpClient, private appService: AppService) { }

  
}
