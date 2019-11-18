import { Controller, Get, Post, Res, Body, Logger, HttpStatus } from '@nestjs/common';
import { FantasyTeamsService } from './fantasy-teams.service';

@Controller('fantasy-teams')
export class FantasyTeamsController {

    constructor(private readonly fantasy: FantasyTeamsService){}

    @Get()
    getTeams(){
        return this.fantasy.getTeams();
    }

    @Post('/add/fteam/')
    async addFTeam(@Res() res, @Body() id: number){
        const fteam = await this.fantasy.addFTeam(id['name']);

        return res.status(HttpStatus.OK).json({
            fteam
        });
    }

    @Post('/add/player')
    async addPlayer(@Res() res, @Body() id: number){
        const player = await this.fantasy.addPlayerToTeam(id['playerId'], id['teamId'])
        
        return res.status(HttpStatus.OK).json({
            player
        });
    }

    @Post('/add/team')
    async addTeam(@Res() res, @Body() id: number) {
        const team = await this.fantasy.addTeamToTeam(id['teamId'], id['fteamId'])
        return res.status(HttpStatus.OK).json({
            team
        });
    }
}
