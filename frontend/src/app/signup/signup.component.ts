import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { SignupService } from './signup.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = "";
  password: string = "";

  emailErrMsg: String = "";
  passErrMsg: String = "";
  errMsg: String = "";

  constructor(private signupService: SignupService, private router: Router, private appService: AppService) { }

  async onSubmit(){
    let res = await this.signupService.register(this.email, this.password);
    if(res){
      this.router.navigate(['/login']);
    }
    else{
      this.errMsg = "NOPE";
    }
  }
}
