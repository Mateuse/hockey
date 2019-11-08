import { Controller, Get, Param, OnModuleInit } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {

    constructor(private readonly teamsService: TeamsService) {}

    @Get()
    getTeams(){
        return this.teamsService.teams;
    }

    @Get("team/:teamname")
    getTeam(@Param('teamname') teamname) {
        let team = this.teamsService.getTeam(teamname)
        if(team == null){
            return `Cant find team ${teamname}`;
        }
        return team;
    }

    @Get("top")
    getTopTeams(){
        return this.teamsService.topTeams();
    }
}
