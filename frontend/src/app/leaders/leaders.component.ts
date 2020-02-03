import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { SimplePlayer } from '../../models/simplePlayer';
import { SimpleGoalie } from '../../models/simpleGoalie';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit {
  private ip: string;
  private topPlayers: Array<SimplePlayer> = [];
  private topGoalies: Array<SimpleGoalie> = [];
  private simplePlayerParams: Array<string>;
  p: number = 1

  sortedDataPlayer: SimplePlayer[];
  sortedDataGoalie: SimpleGoalie[];

  constructor(private http: HttpClient, private appService: AppService) { 
    this.ip = appService.getIp()
  }

  async ngOnInit() {
    await this.getTopPlayers();
    await this.getTopGoalies();
    this.sortedDataPlayer = this.topPlayers;
    this.sortedDataGoalie = this.topGoalies;
  }

  async getTopPlayers(){
    await this.http.get(`${this.ip}/players/top`)
      .toPromise().then(res => {
        for(let x in res){
          this.topPlayers.push(res[x])       
        }
      })
  }

  async getTopGoalies(){
    await this.http.get(`${this.ip}/players/top/goalies`)
      .toPromise().then(res => {
        for (let x in res) {
          this.topGoalies.push(res[x])       
        }
      })
  }

  sortData(sort: Sort, type){
    if(type == 'player')
      this.sortedDataPlayer = SimplePlayer.dataSort(this.sortedDataPlayer, sort);
    if(type == 'goalie')
      this.sortedDataGoalie = SimpleGoalie.dataSort(this.sortedDataGoalie, sort);
  }

  

  displayParams(type) {
    if(type == 'player')
      return SimplePlayer.displayParams;
    if(type == 'goalie')
      return SimpleGoalie.displayParams;
  }
  
}
