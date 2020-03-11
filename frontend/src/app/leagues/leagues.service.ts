import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class LeaguesService {

  constructor(private http: HttpClient, private appService: AppService) { }

  async getUserLeagues(user: User){
    console.log(user)
    if(user.leagues.length > 0){
      return user.leagues;
    }
    else{
      return null;
    }
  }
}
