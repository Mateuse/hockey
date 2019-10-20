import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { TeamsService } from './teams/teams.service';
import { PlayersService } from './players/players.service';

@Controller()
export class AppController implements OnModuleInit{
  constructor(private readonly appService: AppService) {}

  onModuleInit(){
    this.appService.initApp();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
