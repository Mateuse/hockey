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
        let result = this.playersService.getPlayerByName(player);
        if(result == null){
            return `${player} was not found`;
        }
        return result;
    }

    @Get("stats/:player")
    getPlayerStats(@Param('player') player){
        return this.playersService.getStatsForPlayer(player);
    }

    //date is YYYYyyyy ex: 20182019
    @Get("season/:season")
    getSeasonStats(@Param('season') season) {
        return this.playersService.getSeasonStats(season);
    }

    @Get("top")
    getTopPlayersStats(){
        return this.playersService.topPlayers();
    }

    @Get("historicalCurrentPlayers")
    getHistoricalCurrentPlayers(){
        return this.playersService.historicLeadersCurrentPlayers();
    }

    @Get("top/forwards")
    getTopForwardsStats() {
        return this.playersService.topPlayers("forwards");
    }

    @Get("top/defense")
    getTopDefenseStats() {
        return this.playersService.topPlayers("defense");
    }

    @Get("top/goalies")
    getTopGoaliesStats() {
        return this.playersService.topPlayers("goalies");
    }
}
