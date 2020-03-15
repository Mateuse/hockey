import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { CreateLeagueService } from './create-league.service'
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-create-league',
  templateUrl: './create-league.component.html',
  styleUrls: ['./create-league.component.scss']
})
export class CreateLeagueComponent implements OnInit {
  private ip: string;
  private current: string = "rules"
  private availableName: boolean = true;

  leagueName: string = "d";
  commissioner: string = this.appService.getCurrentUser();

  numberOfForwards: number = 0;
  numberOfDefense: number = 0;
  numberOfGoalies: number = 0;
  numberOfTeams: number = 0;

  forwardGoals: number = 0;
  forwardAssists: number = 0;
  forwardPPG: number = 0;
  forwardSHG: number = 0;
  forwardShots: number = 0;
  forwardGWG: number = 0;
  forwardHits: number = 0;
  forwardPIM: number = 0;

  defenseGoals: number = 0;
  defenseAssists: number = 0;
  defensePPG: number = 0;
  defenseSHG: number = 0;
  defenseShots: number = 0;
  defenseGWG: number = 0;
  defenseHits: number = 0;
  defensePIM: number = 0;

  goalieWins: number = 0;
  goalieOTL: number = 0;
  goalieShutout: number = 0;
  goalieSaves: number = 0;
  goalieGA: number = 0;

  teamWin: number = 0;
  teamOTL: number = 0;



  constructor(private http: HttpClient, private appService: AppService,
            private createLeagueService: CreateLeagueService, private router: Router) {
    this.ip = this.appService.getIp()
   }

  ngOnInit() {
    this.checkName(this.leagueName)
  }

  async onSubmit(){
    var pointRules = this.buildPointJSON();
    var positionRules = this.buildPositionJson();

    let res = await this.createLeagueService.createLeague(this.leagueName, this.commissioner, positionRules, pointRules);
    if(res["league"] == false){
      alert("NOPE")
    }
    else{
      let user: User = this.appService.getUser();
      user.leagues.push(this.leagueName);
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log(this.appService.getUser())
      this.router.navigate(["/leagues"])
    }
  }

  async checkName(name){
    this.availableName = await this.createLeagueService.checkName(this.leagueName);   
  }



  buildPointJSON() {
    var json = {
      "forwards": {
        "goals": this.forwardGoals,
        "assists": this.forwardAssists,
        "powerPlayGoals": this.forwardPPG,
        "shortHandedGoals": this.forwardSHG,
        "shots": this.forwardShots,
        "gameWinningGoals": this.forwardGWG,
        "hits": this.forwardHits,
        "pim": this.forwardPIM
      },
      "defense": {
        "goals": this.defenseGoals,
        "assists": this.defenseAssists,
        "powerPlayGoals": this.defensePPG,
        "shortHandedGoals": this.defenseSHG,
        "shots": this.defenseShots,
        "gameWinningGoals": this.defenseGWG,
        "hits": this.defenseHits,
        "pim": this.defensePIM
      },
      "goalie":{
        "wins": this.goalieWins,
        "ot": this.goalieOTL,
        "saves": this.goalieSaves,
        "shutouts": this.goalieShutout,
        "goalsAgainst": this.goalieGA
      },
      "teams":{
        "wins": this.teamWin,
        "ot": this.teamOTL
      }
    }

    return json
  }

  buildPositionJson(){
    var json = {
      "forwards": this.numberOfForwards,
      "defense": this.numberOfDefense,
      "goalies": this.numberOfGoalies,
      "teams": this.numberOfTeams
    }

    return json
  }

}
