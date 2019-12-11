import { Controller, Get, UseGuards, Post, Res, Param, HttpStatus, Body } from '@nestjs/common';
import { LeagueService } from './league.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('league')
export class LeagueController {

    constructor(private readonly leagueService: LeagueService){}

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
}
