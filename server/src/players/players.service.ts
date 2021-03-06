import { Injectable, Logger } from '@nestjs/common';
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
                                    "team": parseInt(element),
                                    "stats": null,
                                    "link": p.person.link,
                                    "position": p.position.abbreviation,
                                    "poolPoints": 0,
                                    "poolTeam": null,
                                    "acquisitionDate": null,
                                    "history": []
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
                            player.poolPoints = this.getPoolPoints(player.stats, player.position);
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

    async getSeasonTotalStatHistory(){
        this.logger.log(`entered getSeasonTotalStatHistory()`);
        this.players.forEach(async p => {
            await this.http.get(`https://statsapi.web.nhl.com/api/v1/people/${p.id}/stats?stats=yearByYear`)
                .toPromise().then(res => {
                    let history = res.data.stats[0].splits;
                    let temp = [];
                    for(let x in history){
                        if(history[x].league.id == 133){
                            history[x]["poolPoints"] = this.getPoolPoints(history[x].stat, p.position)
                            temp.push(history[x])
                        }
                    }
                    p.history = temp;
                    this.updatePlayer(p["_id"], p);
                });
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
                    player.poolPoints = this.getPoolPoints(player.stats, player.position)

                    resolve("Done");
                });           
    }    

    topPlayers(query = "skaters"): any{
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
        if(query == "skaters"){
            players = forwards.concat(defense);
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
        
        let temp = [];
        for(let x in players){
            this.logger.debug(players[x].stats["goals"])
            let player = {
                "name": players[x].fullName,
                "poolPoints": players[x].poolPoints,
                "poolPointsPerGame": this.getPoolPointsPerGame(players[x].poolPoints, players[x].stats["games"]),
                "goals": players[x].stats["goals"],
                "games": players[x].stats["games"],
                "assists": players[x].stats["assists"],
                "ppg": players[x].stats["powerPlayGoals"],
                "gwg": players[x].stats["gameWinningGoals"],
                "wins": players[x].stats["wins"],
                "shutouts": players[x].stats["shutouts"],
                "team": this.teamService.getTeamById(players[x].team).name,
                "position": players[x].position
            }
            temp.push(player)
        }
        
        return temp.sort((a, b) => (a.poolPoints > b.poolPoints ? -1 : ((b.pointRules > a.poolPoints) ? 1 : 0)))
    }

    getTopPlayers(players, type, rules = this.rulesService.pointRules){
        for(let x in players){
            let points = 0;
            for(let y in rules[type]){
                points += players[x].stats[y] * rules[type][y];
            }
            players[x]["poolPoints"] = points;
        }
        return players.sort((a, b) => (a.poolPoints > b.poolPoints ? -1 : ((b.pointRules > a.poolPoints) ? 1 : 0)))
    }

    historicLeadersCurrentPlayers(){
        this.logger.log("entered historicLeadersCurrentPlayers()")
        var leaders = []
        for(let x in this.players){
            for(let y in this.players[x].history){
                if (this.players[x].history[y].stat["games"] > 20){
                    let leader = {
                        "name": this.players[x].fullName,
                        "poolPoints": this.getPoolPoints(this.players[x].history[y].stat, this.players[x].position),
                        "poolPointsPerGame": this.getPoolPointsPerGame(this.getPoolPoints(this.players[x].history[y].stat, this.players[x].position), this.players[x].history[y].stat["games"]),
                        "games": this.players[x].history[y].stat["games"],
                        "goals": this.players[x].history[y].stat["goals"],
                        "assists": this.players[x].history[y].stat["assists"],
                        "ppg": this.players[x].history[y].stat["powerPlayGoals"],
                        "gwg": this.players[x].history[y].stat["gameWinningGoals"],
                        "wins": this.players[x].history[y].stat["wins"],
                        "shutouts": this.players[x].history[y].stat["shutouts"],
                        "season": this.players[x].history[y].season,
                        "team": this.players[x].history[y].team["name"]
                    }
                    leaders.push(leader);
                }                
            }
        }
        return leaders.sort((a, b) => (a.poolPoints > b.poolPoints ? -1 : ((b.pointRules > a.poolPoints) ? 1 : 0)));
    }

    //only active players
    getSeasonStats(season) {
        this.logger.log(`entered getSeasonStats for season ${season}`);
        var leaders = [];
        for(let x in this.players){
            for(let y in this.players[x].history){
                if(this.players[x].history[y].season == season){
                    let leader = {
                        "name": this.players[x].fullName,
                        "poolPoints": this.getPoolPoints(this.players[x].history[y].stat, this.players[x].position),
                        "poolPointsPerGame": this.getPoolPointsPerGame(this.getPoolPoints(this.players[x].history[y].stat, this.players[x].position), this.players[x].history[y].stat["games"]),
                        "games": this.players[x].history[y].stat["games"],
                        "goals": this.players[x].history[y].stat["goals"],
                        "assists": this.players[x].history[y].stat["assists"],
                        "ppg": this.players[x].history[y].stat["powerPlayGoals"],
                        "gwg": this.players[x].history[y].stat["gameWinningGoals"],
                        "wins": this.players[x].history[y].stat["wins"],
                        "shutouts": this.players[x].history[y].stat["shutouts"],
                        "season": this.players[x].history[y].season,
                        "team": this.players[x].history[y].team["name"]
                    }
                    leaders.push(leader);
                }
            }
        }
        return leaders.sort((a, b) => (a.poolPoints > b.poolPoints ? -1 : ((b.pointRules > a.poolPoints) ? 1 : 0)));
    }

    getPoolPoints(stats, position){
        
        let type = "";
        if (position == 'C' || position == 'RW' || position == 'LW') {
            type = "forward"
        }
        else if (position == 'D') {
            type = 'defense';
        }
        else if (position == 'G') {
           type = 'goalie';
        }
        let points = 0;

        for (let x in this.rulesService.pointRules[type]) {
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

    getPoolPointsPerGame(poolPoints: number, games: number): string{
        return (poolPoints/games).toFixed(2);
    }
}
