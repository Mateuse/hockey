import { Controller, Get, OnModuleInit, Param  } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController{

    constructor(private readonly playersService: PlayersService) { }
    @Get()
    getPlayers() {
        return this.playersService.players;
    }

    @Get("/player/:player")
    getPlayer(@Param('player') player) {
        return this.playersService.getPlayerByName(player);
    }

    @Get("stats/:player")
    getPlayerStats(@Param('player') player){
        return this.playersService.getStatsForPlayer(player);
    }

    @Get("top")
    getTopPlayersStats(){
        return this.playersService.topPlayers("points");
    }
}
