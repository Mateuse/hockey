import { Controller, Get, OnModuleInit, Param  } from '@nestjs/common';
import { PlayersService } from './players.service';
import { getHeapStatistics } from 'v8';

@Controller('players')
export class PlayersController implements OnModuleInit{

    constructor(private readonly playersService: PlayersService) { }

    onModuleInit(){
        this.playersService.getPlayersFromFile()
    }

    @Get()
    getPlayers() {
        this.playersService.savePlayers();
        return this.playersService.getPlayersFromFile();
    }

    @Get(":player")
    getPlayer(@Param('player') player) {
        return this.playersService.getPlayerByName(player);
    }

    @Get("stats/:player")
    getPlayerStats(@Param('player') player){
        return this.playersService.getStatsForPlayer(player);
    }
}
