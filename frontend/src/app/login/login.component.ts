import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  private email: string = "";
  private password: string = "";

  private emailErrMsg: String = "";
  private passErrMsg: String = "";
  private errMsg: String = "";

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) { }

  async onSubmit(){
    let res = await this.loginService.login(this.email, this.password);
    if(res){
      this.router.navigate(['/home']);
    }
    else{
      this.errMsg = "MOPE"
    }
  }
  
}
