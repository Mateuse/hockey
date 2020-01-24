import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StartupComponent } from './startup/startup.component';
import { AuthGuard } from './_helpers/auth.guard';
import { League } from 'src/models/league';
import { LeadersComponent } from './leaders/leaders.component';


const routes: Routes = [
  { path: '', component: StartupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'leagueleaders', component: LeadersComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
