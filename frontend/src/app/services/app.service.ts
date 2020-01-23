import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private backendIp = 'http://localhost:3000';

  getIp(): string {
    return this.backendIp;
  }

  getToken(): string{
    return localStorage.getItem("jwt");
  }

  getUserId(): string{
    return localStorage.getItem("userId");
  }

  getCurrentUser(){
    return JSON.parse(localStorage.getItem("currentUser")).user;
  }

  clearUser(){
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser");
  }

  isLoggedIn(): boolean{
    if(localStorage.getItem("jwt") != undefined && localStorage.getItem("userId") != undefined && localStorage.getItem("currentUser") != undefined){
      return true;
    }
    return false;
  }

}
