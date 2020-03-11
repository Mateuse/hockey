import { Controller, Get, OnModuleInit, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TeamsService } from './teams/teams.service';
import { PlayersService } from './players/players.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication/authentication.service';

@Controller()
export class AppController implements OnModuleInit{
  constructor(private readonly appService: AppService, private readonly authService: AuthenticationService) {}

  onModuleInit(){
    this.appService.initApp();
  }

  // @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req){
    return this.authService.login(req.body);
  }
}
