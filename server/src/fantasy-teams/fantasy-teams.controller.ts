import { Controller, Get, Post, Res, Body, UseGuards, HttpStatus, Param } from '@nestjs/common';
import { FantasyTeamsService } from './fantasy-teams.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('fantasy-teams')
export class FantasyTeamsController {

    constructor(private readonly fantasy: FantasyTeamsService){}
    
    @UseGuards(AuthGuard('jwt'))
    @Get()
    getTeams(){
        return this.fantasy.getTeams();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/team/:team')
    getTeam(@Param('team') team) {
        return this.fantasy.getTeam(team);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/add/fteam/')
    async addFTeam(@Res() res, @Body() id: number){
        const fteam = await this.fantasy.addFTeam(id['name']);

        return res.status(HttpStatus.OK).json({
            fteam
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/add/player')
    async addPlayer(@Res() res, @Body() id: number){
        const player = await this.fantasy.addPlayerToTeam(id['playerId'], id['fTeamName'])
        
        return res.status(HttpStatus.OK).json({
            player
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/add/team')
    async addTeam(@Res() res, @Body() id: number) {
        const team = await this.fantasy.addTeamToTeam(id['teamId'], id['fTeamName'])
        return res.status(HttpStatus.OK).json({
            team
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/trade')
    async trade(@Res() res, @Body() id: number){
        const trade = await this.fantasy.trade(id);
        return res.status(HttpStatus.OK).json({
            trade
        });
    }
}
