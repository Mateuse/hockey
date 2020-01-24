import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { SimplePlayer } from '../../models/simplePlayer';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit {
  private ip: string;
  private topPlayers: Array<SimplePlayer> = [];
  private simplePlayerParams: Array<string>;

  sortedData: SimplePlayer[];

  constructor(private http: HttpClient, private appService: AppService) { 
    this.ip = appService.getIp()
  }

  async ngOnInit() {
    await this.getTopPlayers();
    this.sortedData = this.topPlayers
  }

  async getTopPlayers(){
    await this.http.get(`${this.ip}/players/top`)
      .toPromise().then(res => {
        for(let x in res){
          this.topPlayers.push(res[x])     
          // if(parseInt(x) > 200){
          //   break;
          // }    
        }
      })
  }

  sortData(sort: Sort){
    const data = this.topPlayers.slice();
    if(!sort.active || sort.direction === ''){
      this.sortedData = data;
      return;
    }
    console.log(sort)
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch(sort.active){
        case 'Games': return this.compare(a.games, b.games, isAsc);
        case 'Goals': return this.compare(a.goals, b.goals, isAsc);
        case 'Assists': return this.compare(a.assists, b.assists, isAsc);
        case 'PPG': return this.compare(a.ppg, b.ppg, isAsc);
        case 'GWG': return this.compare(a.gwg, b.gwg, isAsc);
        case 'Pool Points': return this.compare(a.poolPoints, b.poolPoints, isAsc);
        case 'PPPG': return this.compare(a.poolPointsPerGame, b.poolPointsPerGame, isAsc);
        default: return 0;
      }
    })
  }

  compare(a: number, b: number, isAsc: boolean){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  displayParams() {
    return ["Name", "Games", "Goals", "Assists", "GWG", "PPG", "Pool Points", "PPPG", "Position", "Team"]
  }
  
}
