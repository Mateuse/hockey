
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppService } from '../app.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
    constructor(private router: Router, private appService: AppService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        try{
            const currentUser = this.appService.getCurrentUser()
            if (currentUser) {
                return true;
            }
        }
        catch(err){
            this.router.navigate(['/login']);
            return false;
        }
    }
}