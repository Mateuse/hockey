import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private ip: string;

  constructor(private http: HttpClient, private appService: AppService) {
    this.ip = appService.getIp();
  }

  async register(email: string, password: string){
    const user: User = Object.assign({email: email, password: password});

    return await this.http.post(this.ip + '/users/add', user, {responseType: 'text'})
      .toPromise()
      .then(
        res => {
          let resp = JSON.parse(res);
          return true;
        }
      )
      .catch(
        err => {
          return err;
        }
      )
  }
}
