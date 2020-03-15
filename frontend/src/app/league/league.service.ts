import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '@src/app/app.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  private ip: string;

  constructor(private http: HttpClient, private appService: AppService,
    private router: Router) { 
    this.ip = this.appService.getIp();
  }

  async getLeague(l: string){
    
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.appService.getToken()}` 
    })

    return await this.http.get(`${this.ip}/league/get/${l}`, { headers: header})
      .toPromise()
      .then(
        res => {
          return res;
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
