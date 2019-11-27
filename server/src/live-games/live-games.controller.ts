import { Controller, Get, Param } from '@nestjs/common';
import { LiveGamesService } from './live-games.service';

@Controller('live-games')
export class LiveGamesController {

    constructor(private readonly liveGamesService: LiveGamesService){}

    @Get()
    getLiveGames(){
        return this.liveGamesService.getBoxScores();
    }

    @Get("/game/:gameId")
    getLiveGame(@Param('gameId') gameId){
        return this.liveGamesService.getBoxScore(gameId)
    }

    @Get("stats/:gameId")
    getLiveStats(@Param('gameId') gameId) {
        return this.liveGamesService.getLiveStats(gameId)
    }
}
