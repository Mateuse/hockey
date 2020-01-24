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
  private email: string = "";
  private password: string = "";

  private emailErrMsg: String = "";
  private passErrMsg: String = "";
  private errMsg: String = "";

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
  
}
