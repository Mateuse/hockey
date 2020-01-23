import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {
  user;
  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    if(this.isLoggedIn()){
      this.router.navigate(['/home'])
    }
    else{

      this.router.navigate(['/login'])
    }
  }

  isLoggedIn(): boolean{
    let loggedIn = this.appService.isLoggedIn();

    if(loggedIn){
      this.user - this.appService.getCurrentUser();
    }
    else{
      this.user = undefined;
    }
    return loggedIn;
  }
}
