import { Controller, Get, Post, UseGuards, Res, Body, HttpStatus } from '@nestjs/common';
import { LeagueService } from './league.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('league')
export class LeagueController {

    constructor(private readonly leagueService: LeagueService){}

    @Get("")
    getLeagues(){
        
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("addLeague")
    async addLeague(@Res() res, @Body() id: number){
        console.log(id)
        const league = await this.leagueService.addLeague(JSON);
        return res.status(HttpStatus.OK).json({
            league
        })
    }
}
