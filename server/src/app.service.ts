import { Injectable } from '@nestjs/common';
import { PlayersService } from './players/players.service';
import { TeamsService } from './teams/teams.service';
import { resolve } from 'url';

@Injectable()
export class AppService {
  constructor(private readonly playersService: PlayersService, private readonly teamsService: TeamsService){}

  initApp(){
      return new Promise((resolve, reject) => {
         resolve(this.teamsService.getTeams());
      }).then(() => {
        this.playersService.getPlayersFromAllTeams();
      })
  }

  getHello(): string {
    return 'Hello World!';
  }


}
