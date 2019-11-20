import { Controller, Get, Post, Res, Body, Logger, HttpStatus, Param } from '@nestjs/common';
import { FantasyTeamsService } from './fantasy-teams.service';

@Controller('fantasy-teams')
export class FantasyTeamsController {

    constructor(private readonly fantasy: FantasyTeamsService){}

    @Get()
    getTeams(){
        return this.fantasy.getTeams();
    }

    @Get('/team/:team')
    getTeam(@Param('team') team) {
        return this.fantasy.getTeam(team);
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
        const player = await this.fantasy.addPlayerToTeam(id['playerId'], id['fTeamName'])
        
        return res.status(HttpStatus.OK).json({
            player
        });
    }

    @Post('/add/team')
    async addTeam(@Res() res, @Body() id: number) {
        const team = await this.fantasy.addTeamToTeam(id['teamId'], id['fTeamName'])
        return res.status(HttpStatus.OK).json({
            team
        });
    }
}
