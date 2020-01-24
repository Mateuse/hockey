import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // if testing on a device that is not hosting the server don't use localhost
  private backendIp = 'http://10.177.45.116:3000';

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
    return localStorage.getItem("currentUser");
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
