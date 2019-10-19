import { Controller, Get, Param, OnModuleInit } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController implements OnModuleInit{

    constructor(private readonly teamsService: TeamsService) {}

    onModuleInit(){
        this.teamsService.getTeams();
    }

    @Get()
    getDefaultWatermarks(){
        return this.teamsService.teams;
    }

    @Get(":teamname")
    getTeam(@Param('teamname') teamname) {
        return this.teamsService.getTeam(teamname)
    }
}
