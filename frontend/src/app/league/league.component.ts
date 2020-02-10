import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {
  private ip: string;
  constructor(private http: HttpClient, private appService: AppService) {
    this.ip = appService.getIp();
   }

  ngOnInit() {
    
  }

}
