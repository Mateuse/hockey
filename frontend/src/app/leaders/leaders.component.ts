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
  private topForwards: Array<SimplePlayer> = [];
  private topDefense: Array<SimplePlayer> = [];
  display: string = "Players";

  p: number = 1

  sortedDataPlayer: SimplePlayer[];
  sortedDataGoalie: SimpleGoalie[];
  sortedDataForward: SimplePlayer[];
  sortedDataDefense: SimplePlayer[];

  constructor(private http: HttpClient, private appService: AppService) { 
    this.ip = appService.getIp()
  }

  async ngOnInit() {
    await this.getTopPlayers();
    await this.getTopGoalies();
    await this.getTopForwards();
    await this.getTopdefence();
    this.sortedDataPlayer = this.topPlayers;
    this.sortedDataGoalie = this.topGoalies;
    this.sortedDataForward = this.topForwards;
    this.sortedDataDefense = this.topDefense;
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

  async getTopForwards(){
    await this.http.get(`${this.ip}/players/top/forwards`)
      .toPromise().then(res => {
        for (let x in res) {
          this.topForwards.push(res[x])
        }
      })
  }

  async getTopdefence() {
    await this.http.get(`${this.ip}/players/top/defense`)
      .toPromise().then(res => {
        for (let x in res) {
          this.topDefense.push(res[x])
        }
      })
  }

  sortData(sort: Sort, type){
    if(type == 'player')
      this.sortedDataPlayer = SimplePlayer.dataSort(this.sortedDataPlayer, sort);
    if(type == 'goalie')
      this.sortedDataGoalie = SimpleGoalie.dataSort(this.sortedDataGoalie, sort);
    if(type == 'forward')
      this.sortedDataForward = SimplePlayer.dataSort(this.sortedDataForward, sort);
    if(type == 'defense')
      this.sortedDataDefense = SimplePlayer.dataSort(this.sortedDataDefense, sort);

  }

  displayParams(type) {
    if(type == 'player')
      return SimplePlayer.displayParams;
    if(type == 'goalie')
      return SimpleGoalie.displayParams;
    if(type == 'forward')
      return SimplePlayer.displayParams;
    if(type == 'defense')
      return SimplePlayer.displayParams;
  }
}
