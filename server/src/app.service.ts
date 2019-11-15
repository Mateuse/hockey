import { Injectable } from '@nestjs/common';
import { PlayersService } from './players/players.service';
import { TeamsService } from './teams/teams.service';
import { resolve } from 'url';
import { rejects } from 'assert';

@Injectable()
export class AppService {
  constructor(private readonly playersService: PlayersService, private readonly teamsService: TeamsService){}

  async initApp(){
      await this.teamsService.getTeams();
      await this.teamsService.getTeamsStats();
      await this.playersService.getPlayersFromAllTeams();
      await this.playersService.getStatsForPlayers();
  }

  getHello(): string {
    return 'Hello World!';
  }


}
