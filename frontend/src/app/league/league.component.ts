import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { LeagueService } from './league.service';
import { League } from '../../models/league';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {
  private ip: string;
  private leagueName: string;
  private league: League;

  constructor(private http: HttpClient, private appService: AppService, private route: ActivatedRoute,
          private leagueService: LeagueService) {
    this.ip = appService.getIp();
   }

  async ngOnInit() {
    this.leagueName = this.route.snapshot.paramMap.get("league");
    this.league = await this.leagueService.getLeague(this.leagueName);
    console.log(this.league)
  }

}
