import { Component, OnInit } from '@angular/core';
import { League } from 'src/models/league';
import { LeaguesService } from './leagues.service';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent implements OnInit {
  private userLeagues: League[] = null;

  leagueName: string = "";


  constructor(private leaguesSevice: LeaguesService, private appService: AppService, private router: Router) { }

  async ngOnInit() {
    this.userLeagues = await this.leaguesSevice.getUserLeagues(this.appService.getUser());
  }

}
