import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { User } from '../../models/user';
import { validate } from 'email-validator';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private ip: String;
  constructor(private http: HttpClient, appService: AppService) {
    this.ip = appService.getIp()
  }

  async login(email, password){

    const user: User = Object.assign({email: email, password: password})

    return await this.http.post(this.ip + '/auth/login', user, { responseType: 'text'})
      .toPromise()
      .then(
        res => {
          let resp = JSON.parse(res);
          try{
            localStorage.setItem("currentUser", resp.user.email);
            localStorage.setItem("jwt", resp.access_token);
            localStorage.setItem("userId", resp.user.id);
            localStorage.setItem("user", resp.user);
            return true;
          }catch(err){
            return resp.response.err;
          }
        },
        err =>{
          if(err.status == 401 || err.status == 500){
            return err.error;
          }
          else{

            return JSON.stringify(err)
          }
        }
      )
  }

  validateEmail(email){
    return validate(email);
  }

  
}
