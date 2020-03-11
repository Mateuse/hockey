import { Injectable, OnInit } from '@angular/core';
import { environment as dev } from '../environments/environment';
import { environment as prod } from '../environments/environment.prod';
import { User } from 'src/models/user';
@Injectable({
  providedIn: 'root'
})
export class AppService{
  // if testing on a device that is not hosting the server don't use localhost
  
  private backendIp: string

  checkEnv(): string{
    if (dev.production == false) {
      return dev.apiUrl;
    }
    return prod.apiUrl;
  }

  getIp(): string {
    this.backendIp = this.checkEnv();
    return this.backendIp.toString();
  }

  getToken(): string{
    return localStorage.getItem("jwt");
  }

  getUserId(): string{
    return localStorage.getItem("userId");
  }

  getCurrentUser(){
    return localStorage.getItem("currentUser");
  }

  getUser(): User{
        let user: User = JSON.parse(localStorage.getItem("user"));
        return user;
  }
  clearUser(){
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user")
  }

  isLoggedIn(): boolean{
    if(localStorage.getItem("jwt") != undefined && localStorage.getItem("userId") != undefined && localStorage.getItem("currentUser") != undefined && localStorage.getItem("user") != undefined){
      return true;
    }
    return false;
  }

}
