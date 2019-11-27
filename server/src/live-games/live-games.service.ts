import { Injectable, Logger, HttpService} from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { TeamsService } from '../teams/teams.service';
import { ScheduleService } from '../schedule/schedule.service';
import { LiveGames } from './live-games.interface';

@Injectable()
export class LiveGamesService {
    gameIdsToday: Array<number> = [];
    private readonly logger = new Logger(LiveGamesService.name);

    constructor(private readonly http: HttpService, private readonly playersService: PlayersService,
                private readonly teamsService: TeamsService, private readonly scheduleService: ScheduleService){}

    
    async getLiveGames(){
        var games = await this.scheduleService.getGamesToday();
        this.gameIdsToday = this.scheduleService.getGameIds(games);
    }

    async getBoxScores(){
        for(let x in this.gameIdsToday){
            await this.getBoxScore(this.gameIdsToday[x])
            break
        }
    }

    async getBoxScore(gameId: number): Promise<string>{
        var boxscore = "";
        await this.http.get(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/boxscore`)
            .toPromise().then(res => {
                boxscore = res.data;
            });
        return boxscore 
    }

    async getLiveStats(gameId: number){
        this.logger.log(`entered getLiveStats() for game ${gameId}`)
        var boxscore = await this.getBoxScore(gameId);
        var home = {};
        var away = {};
        
        home["team"] = boxscore["teams"]["home"]["team"]["name"];
        away["team"] = boxscore["teams"]["away"]["team"]["name"];
        home["teamId"] = boxscore["teams"]["home"]["team"]["id"];
        away["teamId"] = boxscore["teams"]["away"]["team"]["id"];
        home["players"] = [];
        away["players"] = [];
        let homePlayers = boxscore["teams"]["home"]["players"]
        for(let x in homePlayers){
            var stats = ""
            if (homePlayers[x]["person"]["primaryPosition"]["abbreviation"] == "G"){
                stats = homePlayers[x]["stats"]["goalieStats"];
            }
            else{                
                stats = homePlayers[x]["stats"]["skaterStats"]
                if(typeof(stats) != 'undefined'){
                    stats["gameWinningGoals"] = 0;
                }                
            }
            if (typeof(stats) != 'undefined') {
                try{
                    let player = {
                        id: homePlayers[x]["person"]["id"],
                        stats: homePlayers[x]["stats"],
                        poolPoints: this.playersService.getPoolPoints(stats, homePlayers[x]["person"]["primaryPosition"]["abbreviation"])
                    }
                    home["players"].push(player)
                }
                catch(err){
                    this.logger.error(err)
                }
            }
        }
        
        let awayPlayers = boxscore["teams"]["away"]["players"];
        for (let x in awayPlayers) {
            var stats = ""
            if (awayPlayers[x]["person"]["primaryPosition"]["abbreviation"] == "G") {
                stats = awayPlayers[x]["stats"]["goalieStats"];
            }
            else {
                stats = awayPlayers[x]["stats"]["skaterStats"]
                if (typeof (stats) != 'undefined') {
                    stats["gameWinningGoals"] = 0;
                }
            }
            if (typeof (stats) != 'undefined') {
                try {
                    let player = {
                        id: awayPlayers[x]["person"]["id"],
                        stats: awayPlayers[x]["stats"],
                        poolPoints: this.playersService.getPoolPoints(stats, awayPlayers[x]["person"]["primaryPosition"]["abbreviation"])
                    }
                    away["players"].push(player)
                }
                catch (err) {
                    this.logger.error(err)
                }
            }
        }
        return [home, away];
    }
}
