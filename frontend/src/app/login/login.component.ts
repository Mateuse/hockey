import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  email: string = "";
  password: string = "";

  emailErrMsg: String = "";
  passErrMsg: String = "";
  errMsg: String = "";

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router, private appService: AppService) { }

  async ngOnInit(){
    const currentUser = this.appService.getCurrentUser()
      if (currentUser != undefined) {
        this.router.navigate(['/home']);
      }
  }

  async onSubmit(){
    let res = await this.loginService.login(this.email, this.password);
    alert(res)
    if(res){
      this.router.navigate(['/home']);
    }
    else{
      this.errMsg = "NOPE"
    }
  }
  

  test() {
    console.log("gelslf")
    this.router.navigate(['/leagueleaders'])
  }
}
