import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { FantasyTeam } from './fantasy-team.interface';
var path = require("path");
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.interface';
import { Team } from '../teams/team.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FantasyDTO } from './fantasy-team.dto';

@Injectable()
export class FantasyTeamsService implements OnModuleInit{
    private readonly logger = new Logger(FantasyTeamsService.name);
    teams: Array<FantasyTeam> = []

    constructor(private readonly teamservice: TeamsService, private readonly playerService: PlayersService,
        @InjectModel('FantasyTeam') private readonly fantasyTeamModel: Model<FantasyTeam>) {}

    async onModuleInit(){
        this.logger.log("Starting FantasyTeamsService")
        this.teams = await this.getAllFantasyTeams();
    }

    checkTeamExists(name: string, teams: Array<FantasyTeam>){
        for(let x in teams){
            if(name == teams[x].name){
                return false
            }
        }
        return true
    }

    
    async addFTeam(name: string, leagueId: string){
        this.logger.log(`entered addFTeam() for new team ${name}`);

        var fTeam: FantasyTeam = {
            "name": name,
            "players": [],
            "teams": [],
            "poolPoints": 0,
            "league": leagueId
        }
        
        this.teams.push(fTeam);
        return await this.saveTeam(fTeam);
    }

    
    setStatsToZero(y: any){
        this.logger.log(`entered setStatsToZero() for ${y.id}`)
        y.poolPoints = 0;
        for(let x in y.stats){
            y.stats[x] = 0;
        }
    }

    async saveTeam(fantasyDTO: FantasyDTO): Promise<FantasyDTO>{
        const newFantasy = await this.fantasyTeamModel(fantasyDTO);
        return newFantasy.save();
    }

    async getAllFantasyTeams(): Promise<FantasyTeam[]>{
        const fantasy = await this.fantasyTeamModel.find().exec();
        return fantasy;
    }

    async updateFantasyTeam(fantasyId, fantasyUpdate: FantasyDTO): Promise<FantasyTeam>{
        const fantasy = await this.fantasyTeamModel.findByIdAndUpdate(fantasyId, fantasyUpdate, { useFindAndModify: false })
        return fantasy;
    }
}
