import { Injectable, Logger, Delete } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service';
import { HttpService } from '@nestjs/common/http';
import { map, catchError} from 'rxjs/operators';
import { RulesService } from '../rules/rules.service';
import { Player } from './player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerDTO } from './player.dto';
import { resolve } from 'path';

@Injectable()
export class PlayersService {
    readonly PLAYERSFILE = "./files/players.json";
    FIRST: boolean = true;
    players: Array<Player> = [];
    private readonly logger = new Logger(PlayersService.name);

    constructor(private readonly http: HttpService, private readonly teamService: TeamsService, private readonly rulesService: RulesService,
                @InjectModel('Player') private readonly playerModel: Model<Player>){}
    
    async getPlayers(): Promise<any>{
        this.players = await this.getAllPlayers();
        if(this.players.length == 0){
            await this.getPlayersFromAllTeams();
            this.players = await this.getAllPlayers();
        }
    }

    async getPlayersFromAllTeams(): Promise<any>{
            this.logger.log("Entered getPlayersFromAllTeams()");
            let ids = this.teamService.getAllTeamsIds();
            var ids_left = ids.length
            for (const element of ids) {
                await this.http.get(`https://statsapi.web.nhl.com/api/v1/teams/${element}/roster`)
                    .toPromise().then(res => {
                            res.data.roster.forEach(async p => {
                                var player: Player = {
                                    "id": p.person.id,
                                    "fullName": p.person.fullName,
                                    "stats": null,
                                    "link": p.person.link,
                                    "position": p.position.abbreviation,
                                    "poolPoints": 0,
                                    "poolTeam": null,
                                    "acquisitionDate": null

                                }
                                await this.savePlayer(player)
                            });
                            ids_left--;
                            if (ids_left == 0) {
                                this.logger.debug('Done getPlayersFromAllTeams()');
                            }
                        },
                        err => {
                            this.logger.error(err);
                        }
                    )                
            }          
    }

    getPlayerByName(player): Player[]{
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
            return null;
        }        
    }

    getPlayerById(id): Player{
        this.logger.log(`Entered getPlayerById() for ${id}`);
        let match = null
        this.players.forEach(p => {            
            if(p.id == id){
                match = p;
                return;
            }
        });
        if(match == null){
            this.logger.log(`${id} not found on active rosters`);
        }
        return match;
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

    async getStatsForPlayers(): Promise<any>{
        this.logger.log("Entered getStatsForPlayers()");
        this.players.forEach(async player => {
            await this.http.get(`https://statsapi.web.nhl.com/api/v1/people/${player.id}/stats?stats=statsSingleSeason`)
                .toPromise().then(res => {
                        try {
                            var stats = res.data.stats[0].splits[0].stat;
                            player.stats = stats;
                            if(player.position == 'C' || player.position == 'RW' || player.position == 'LW'){
                                player.poolPoints = this.getPoolPoints(player.stats, 'forward');
                            }
                            else if(player.position == 'D'){
                                player.poolPoints = this.getPoolPoints(player.stats, 'defense');  
                            }
                            else if(player.position == 'G'){
                                player.poolPoints = this.getPoolPoints(player.stats, 'goalie');
                            }     
                            this.updatePlayer(player["_id"], player);                 
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

    async getStatsAfterDate(player: Player, date): Promise<any>{
            this.logger.log(`Entered get stats after date ${date} for player ${player.fullName}`);     
            date = new Date(date)
            var currentYear = new Date();
            var yearRange = '';
            if (currentYear.getMonth() > 7) {
                let end = currentYear.getFullYear() + 1;
                yearRange = currentYear.getFullYear().toString() + end.toString()
            }
            else {
                let end = currentYear.getFullYear() - 1;
                yearRange = end.toString() + currentYear.getFullYear().toString()
            }
            this.http.get(`https://statsapi.web.nhl.com/api/v1/people/${player.id}/stats?stats=gameLog&season=${yearRange}`)
                .toPromise().then(res => {
                    let set = res.data.stats[0].splits;
                    for (let x in set) {
                        if (new Date(set[x].date) > date) {
                            for (let y in set[x].stat) {
                                player.stats[y] += set[x].stat[y];
                            }
                        }
                    }
                    if (player.position == 'C' || player.position == 'RW' || player.position == 'LW') {
                        player.poolPoints = this.getPoolPoints(player.stats, 'forward');
                    }
                    else if (player.position == 'D') {
                        player.poolPoints = this.getPoolPoints(player.stats, 'defense');
                    }
                    else if (player.position == 'G') {
                        player.poolPoints = this.getPoolPoints(player.stats, 'goalie');
                    }

                    resolve("Done");
                });           
    }

    topPlayers(query = "all"): any{
        this.logger.log(`Entered topPlayers() for query ${query}`);
        return this.sortStats(query);
    }

    sortStats(query){
        let forwards = [];
        let defense = [];
        let goalies = [];
        for(let x in this.players){
            if(this.players[x].stats != undefined){
                if(this.players[x].position == 'D'){
                    defense.push(this.players[x])
                }        
                else if (this.players[x].position == 'G')    {
                    goalies.push(this.players[x])
                }  
                else{
                    forwards.push(this.players[x])
                } 
            }
        }

        let players = []
        if(query == "all"){
            players = forwards.concat(defense);
            players = players.concat(goalies)
        }
        else if(query == "forwards"){
            players = forwards
        }
        else if(query == "defense"){
            players = defense
        }
        else if(query == "goalies"){
            players = goalies
        }      
        
        return players.sort((a, b) => (a.poolPoints > b.poolPoints ? -1 : ((b.pointRules > a.poolPoints) ? 1 : 0)))
    }

    getTopPlayers(players, type, rules = this.rulesService.pointRules){
        for(let x in players){
            let points = 0;
            for(let y in rules[type]){
                points += players[x].stats[y] * rules[type][y];
            }
            players[x]["poolPoints"] = points;
        }
        return players;
    }

    getPoolPoints(stats, type){
        let points = 0;
        for(let x in this.rulesService.pointRules[type]){
            points += stats[x] * this.rulesService.pointRules[type][x]
        }

        return points;
    }

    async savePlayer(playerDTO: PlayerDTO): Promise<Player>{
        const newPlayer = await this.playerModel(playerDTO);
        return newPlayer.save();
    }

    async getAllPlayers(): Promise<Player[]>{
        const players = await this.playerModel.find().exec()
        return players;
    }

    async updatePlayer(playerId, playerUpdate: PlayerDTO): Promise<Player>{
        const player = await this.playerModel.findByIdAndUpdate(playerId, playerUpdate, { useFindAndModify: false })
        return player;
    }
}
