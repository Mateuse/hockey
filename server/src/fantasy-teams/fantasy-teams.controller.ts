import { Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { FantasyTeamsService } from './fantasy-teams.service';

@Controller('fantasy-teams')
export class FantasyTeamsController {

    constructor(private readonly fantasy: FantasyTeamsService){}

    @Get()
    getTeams(){
        return this.fantasy.getTeams();
    }

    @Post('/add/player')
    addPlayer(@Body() id: number){
        return this.fantasy.addPlayerToTeam(id['playerId'], id['teamId'])
    }

    @Post('/add/team')
    addTeam(@Body() id: number) {
        return this.fantasy.addTeamToTeam(id['teamId'], id['fteamId'])
    }
}
