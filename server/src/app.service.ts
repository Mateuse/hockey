import { Injectable } from '@nestjs/common';
import { PlayersService } from './players/players.service';
import { TeamsService } from './teams/teams.service';
import { ScheduleService } from './schedule/schedule.service';
import { LiveGamesService } from './live-games/live-games.service';

@Injectable()
export class AppService {
  constructor(private readonly playersService: PlayersService, private readonly teamsService: TeamsService, private readonly scheduleService: ScheduleService, private readonly liveGameService: LiveGamesService){}

  async initApp(){
      await this.teamsService.getTeams();
      await this.teamsService.getTeamsStats();
      await this.playersService.getPlayers();
      await this.playersService.getStatsForPlayers();
      await this.playersService.getSeasonTotalStatHistory();
      await this.liveGameService.getLiveGames();
  }

  getHello(): string {
    return 'Hello World!';
  }


}
