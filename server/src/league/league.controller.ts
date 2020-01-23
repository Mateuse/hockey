import { Controller, Get, UseGuards, Post, Res, Param, HttpStatus, Body } from '@nestjs/common';
import { LeagueService } from './league.service';
import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs/internal/scheduler/async';

@Controller('league')
export class LeagueController {

    constructor(private readonly leagueService: LeagueService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('/get/:league')
    getLeagueByName(@Param('league') league){
        return this.leagueService.getLeagueByName(league)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/add/league')
    async addLeague(@Res() res, @Body() id: number){
        const league = await this.leagueService.addLeague(id)

        return res.status(HttpStatus.OK).json({
            league
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/add/team/league')
    async addTeamToLeague(@Res() res, @Body() id: number) {
        const team = await this.leagueService.addTeamToLeague(id)

        return res.status(HttpStatus.OK).json({
            team
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/add/player/team')
    async addPlayerTeam(@Res() res, @Body() id){
        const team = await this.leagueService.addPlayerTeam(id);

        return res.status(HttpStatus.OK).json({
            team
        });
    }
}
