import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private user: string;
  token;
  constructor(private http: HttpClient, private appService: AppService) { }

  ngOnInit() {
    this.user = this.appService.getCurrentUser();
    this.token = this.appService.getToken();
  }

  clear(){
    this.appService.clearUser();
    this.user = this.appService.getCurrentUser();
    this.token = this.appService.getToken();
    
  }
}
