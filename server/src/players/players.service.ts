import { Injectable, Logger } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service';
import { HttpService } from '@nestjs/common/http';
import { map, catchError} from 'rxjs/operators';
import { Player } from './player.interface';
import { RulesService } from '../rules/rules.service';

@Injectable()
export class PlayersService {
    readonly PLAYERSFILE = "./files/players.json";
    FIRST: boolean = true;
    players: Array<any> = [];
    private readonly logger = new Logger(PlayersService.name);

    constructor(private readonly http: HttpService, private readonly teamService: TeamsService, private readonly rulesService: RulesService){}

    getPlayersFromAllTeams(): any{
        return new Promise((resolve, reject) => {
            this.logger.log("Entered getPlayersFromAllTeams()");
            let ids = this.teamService.getAllTeamsIds();
            var ids_left = ids.length
            for (const element of ids) {
                this.http.get(`https://statsapi.web.nhl.com/api/v1/teams/${element}/roster`)
                    .subscribe(
                        res => {
                            res.data.roster.forEach(element => {
                                element.person["position"] = element.position.abbreviation
                                this.players.push(element.person);
                            });
                            ids_left--;
                            if (ids_left == 0) {
                                resolve("Got Stats");
                            }
                        },
                        err => {
                            this.logger.error(err)
                            reject(err);
                        }
                    )                
            }
        });            
    }

    getPlayerByName(player): any{
        this.logger.log("Entered getPlayerByName()");
        let matches = []
        let players = this.players;
        players.forEach(p => {
            if((p.fullName).toUpperCase().includes(player.toUpperCase())){
                matches.push(p);
                this.logger.log(`Found player ${p.fullName}`);
            }
        });
        if(matches.length > 0){
            return matches;
        }
        else{
            this.logger.log(`${player} not found on active rosters`);
            return `${player} not found on active rosters`;
        }        
    }

    getStatsForPlayer(player): any{
        this.logger.log("Entered getStatsForPlayer()");
        let found = this.getPlayerByName(player)[0];
        if (typeof(found) !== 'string'){
            this.logger.log(`Sending get request for ${player} stats`);
            return this.http.get(`https://statsapi.web.nhl.com/api/v1/people/${found.id}/stats?stats=statsSingleSeason`)
                .pipe(
                    map(res => res.data.stats[0].splits[0].stat),
                    catchError(err =>{
                        this.logger.error(err);
                        return err;
                    })
                )
        }
        return `${player} not found on active rosters`;
    }

    getStatsForPlayers(): any{
        this.logger.log("Entered getStatsForPlayers()");
        this.players.forEach(player => {
            return this.http.get(`https://statsapi.web.nhl.com/api/v1/people/${player.id}/stats?stats=statsSingleSeason`)
                .subscribe(
                    res => {
                        try {
                            var stats = res.data.stats[0].splits[0].stat;
                            player["stats"] = stats;
                        }
                        catch (err) {
                            this.logger.error(err);
                        }
                    },
                    err => {
                        this.logger.error(err);
                        return err;
                    }
                );
        });        
    }

    topPlayers(param): any{
        this.logger.log("Entered topPlayers()");
        return this.sortStats(param);
    }

    sortStats(param){
        let players = []
        console.log(this.players.length)
        for(let x in this.players){
            if(this.players[x].stats != undefined){
                if(this.players[x].stats[param] != undefined){
                    players.push(this.players[x])
                }                
            }
        }

        return players.sort((a, b) => (a.stats[param] > b.stats[param] ? -1 : ((b.stats[param] > a.stats[param]) ? 1 : 0)))
    }
}
