import { Controller, Get, Param, OnModuleInit } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {

    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    getDefaultWatermarks(){
        return this.teamsService.teams;
    }

    @Get("team/:teamname")
    getTeam(@Param('teamname') teamname) {
        return this.teamsService.getTeam(teamname)
    }

    @Get("top")
    getTopTeams(){
        return this.teamsService.topTeams();
    }
}
