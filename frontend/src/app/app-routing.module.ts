import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StartupComponent } from './startup/startup.component';


const routes: Routes = [
  { path: '', component: StartupComponent },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
