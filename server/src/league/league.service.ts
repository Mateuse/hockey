import { Injectable, HttpService, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { League } from './league.interface';
import { PlayersService } from '../players/players.service';
import { FantasyTeamsService } from '../fantasy-teams/fantasy-teams.service';
import { LeagueDTO } from './league.dto';
import { FantasyTeam } from '../fantasy-teams/fantasy-team.interface';
import { Player } from '../players/player.interface';

@Injectable()
export class LeagueService implements OnModuleInit{
    private readonly logger = new Logger(LeagueService.name);
    leagues: Array<League> = [];

    constructor(private readonly httpService: HttpService, private readonly playersService: PlayersService, private readonly fantasyTeamsService: FantasyTeamsService,
        @InjectModel('League') private readonly leagueModel: Model<League>){}
    
    async onModuleInit(){
        this.leagues = await this.getAllLeaguesDB();
    }

    getLeague(id: string): League{
        for(let x in this.leagues){
            if(this.leagues[x]["_id"] == id){
                return this.leagues[x]
            }
        }
        return null;
    }
    getLeagueByName(name: string): League {
        this.logger.debug(name)
        for (let x in this.leagues) {
            if (this.leagues[x].leagueName == name) {
                return this.leagues[x]
            }
        }
        return null;
    }

    getTeamFromLeague(name: string, teams: Array<FantasyTeam>): FantasyTeam{
        for (let x in teams) {
            if (name == teams[x].name) {
                return teams[x]
            }
        }
        return null
    }

    getPlayerFromLeague(id, players: Array<Player>): Player{
        for (let x in players){
            if (id == players[x].id){
                return players[x]
            }
        }
        return null
    }
    
    async addLeague(l: any){
        var league: League = {
            "leagueName": l["leagueName"],
            "fantasyTeams": [],
            "players": [],
            "teams": [],
            "createdDate": new Date().toISOString().split('T')[0],
            "positionRules": l["positionRules"],
            "pointRules": l["pointRules"]
        }
        
        return this.saveLeague(league)
    }

    async addTeamToLeague(team: any){
        var league = this.getLeague(team["leagueId"]);
        if (league == null) {
            return "League cannot be found"
        }
        if (this.fantasyTeamsService.checkTeamExists(team["fteam"], league.fantasyTeams)){
            var fantasyTeam: FantasyTeam = {
                "name": team["fteam"],
                "players": [],
                "teams": [],
                "poolPoints": 0,
                "league": team["leagueId"]
            }


            this.logger.debug(league)
            league.fantasyTeams.push(fantasyTeam);


            return this.updateLeague(team["leagueId"], league)
        }
        else{
            return `Team ${team["fteam"]} already exists in league`
        }
    }

    async addPlayerTeam(payload): Promise<FantasyTeam>{
        var player= payload["player"];
        var fteam = payload["fteam"];
        var league = payload["league"];

        league = this.getLeagueByName(league);
        fteam = this.getTeamFromLeague(fteam, league.fantasyTeams);
        
        return this.fantasyTeamsService.addPlayer(player, fteam);
    }

    async saveLeague(LeagueDTO: LeagueDTO): Promise<League>{
        const newLeague = await this.leagueModel(LeagueDTO);
        return newLeague.save();
    }

    async getAllLeaguesDB(): Promise<League[]>{
        const leagues = await this.leagueModel.find().exec();
        return leagues;
    }

    async updateLeague(leagueId, leageUpdate: LeagueDTO): Promise<League>{
        const league = await this.leagueModel.findByIdAndUpdate(leagueId, leageUpdate, {useFindAndModify: false});
        return league;
    }

    async getLeagueDB(leagueId): Promise<League>{
        const league = await this.leagueModel.findById(leagueId);
        return league;
    }
}
