import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TeamsService } from './teams/teams.service';
import { PlayersService } from './players/players.service';

@Controller()
export class AppController{
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
