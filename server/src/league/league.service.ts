import { Injectable, HttpService, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { League } from './league.interface';
import { PlayersService } from '../players/players.service';
import { RulesService } from '../rules/rules.service';
import { FantasyTeamsService } from '../fantasy-teams/fantasy-teams.service';
import { LeagueDTO } from './league.dto';
import { FantasyTeam } from 'src/fantasy-teams/fantasy-team.interface';

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
            this.logger.debug(this.leagues[x]["_id"])
            if(this.leagues[x]["_id"] == id){
                return this.leagues[x]
            }
        }
        return null;
    }
    
    async addLeague(l: any){
        var league: League = {
            "leagueName": l["leagueName"],
            "fantasyTeams": [],
            "createdDate": new Date().toISOString().split('T')[0],
            "positionRules": l["positionRules"],
            "pointRules": l["pointRules"]
        }
        
        return this.saveLeague(league)
    }

    async addTeamToLeague(team: any){
        var fantasyTeam: FantasyTeam = {
            "name": team["fteam"],
            "players": [],
            "teams": [],
            "poolPoints": 0,
            "league": team["leagueId"]
        }        
        
        var league = this.getLeague(team["leagueId"]);
        if(league == null){
            return "League cannot be found"
        }
        this.logger.debug(league)
        league.fantasyTeams.push(fantasyTeam);
        

        return this.updateLeague(team["leagueId"], league)
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
        const league = await this.leagueModel.findByIdAndUpdate(leagueId, leageUpdate);
        return league;
    }

    async getLeagueDB(leagueId): Promise<League>{
        const league = await this.leagueModel.findById(leagueId);
        return league;
    }
}
