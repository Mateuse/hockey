import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { HomeComponent } from 'src/app/home/home.component';
import { LoginComponent } from 'src/app/login/login.component';
import { StartupComponent } from 'src/app/startup/startup.component';
import { HttpClientModule } from '@angular/common/http';
import { LeadersComponent } from 'src/app/leaders/leaders.component';
import { TestPipe } from './pipes/test.pipe';
import { SimplePlayerPipe } from './pipes/simple-player.pipe';
import { SimpleGoaliePipe } from './pipes/simple-goalie.pipe';
import { LeagueComponent } from './league/league.component';
import { LeaguesComponent } from './leagues/leagues.component';
import { SignupComponent } from './signup/signup.component';
import { CreateLeagueComponent } from './create-league/create-league.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    StartupComponent,
    LeadersComponent,
    TestPipe,
    SimplePlayerPipe,
    SimpleGoaliePipe,
    LeagueComponent,
    LeaguesComponent,
    SignupComponent,
    CreateLeagueComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    NgxPaginationModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
