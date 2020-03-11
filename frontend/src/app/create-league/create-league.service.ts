import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { League } from '../../models/league';

@Injectable({
  providedIn: 'root'
})
export class CreateLeagueService {
  private ip: string;

  constructor(private http: HttpClient, private appService: AppService) {
    this.ip = this.appService.getIp()
  }

  async createLeague(name, commissioner, positionRules, pointRules){

    const league: League = Object.assign({ leagueName: name, commissioner: commissioner, pointRules: pointRules, positionRules: positionRules});

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.appService.getToken()}` 
    })

      return await this.http.post(this.ip + '/league/add/league', league, { headers: header})
        .toPromise()
        .then(
          res => {
            return res        
          },
          err => {
            if (err.status == 401 || err.status == 500) {
              return err.error;
            }
            else {
              return JSON.stringify(err);
            }
          }
        )
  }

  async checkName(name){
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.appService.getToken()}`
    });

    var league = { "name": name, "user": this.appService.getCurrentUser()}
    return await this.http.post(`${this.ip}/league/checkname`, league, { headers: header})
      .toPromise()
      .then(
        res => {
          
          return res["name"]
        },
        err => {
          if (err.status == 401 || err.status == 500) {
            return err.error;
          }
          else {
            return JSON.stringify(err);
          }
        }
      )
  }
}
