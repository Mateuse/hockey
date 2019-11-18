import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { FantasyTeam } from './fantasy-team.interface';
var path = require("path");
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.interface';
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
        this.logger.debug(this.teams)
    }

    getTeams(){
        return this.teams
    }

    getTeamByName(name: string): FantasyTeam{
        this.logger.log(`Entered getTeamId() for teamId ${name}`)
        let team = null;
        this.teams.forEach(t => {
            if(t.name == name){
                team = t;
                return;
            }
        });
        return team;
    }

    async addFTeam(name: string){
        this.logger.log(`entered addFTeam() for new team ${name}`);
        var fTeam: FantasyTeam = {
            "name": name,
            "players": [],
            "teams": [],
            "poolPoints": 0 
        }
        return await this.saveTeam(fTeam);
    }

    async addPlayerToTeam(playerId: number, name: string){
        this.logger.log(`entered addPlayerToTeam for playerID ${playerId} and teamId ${name}`)
        let team = this.getTeamByName(name);
        let player = await this.playerService.getPlayerById(playerId);
        
        if(player.poolTeam != null){
            return `${player.fullName} is already apart of a team '${team.name}'`
        }
        player.poolTeam = team["_id"]
        player.acquisitionDate = new Date("October 13, 2019 11:13:00").toISOString().split('T')[0];
        var playerCopy = Object.assign({}, player)
        this.setStatsToZero(playerCopy["_doc"])
        await this.playerService.getStatsAfterDate(playerCopy["_doc"], playerCopy["_doc"].acquisitionDate)
        team.poolPoints += playerCopy["_doc"].poolPoints;
        team.players.push(playerCopy["_doc"]);
        await this.updateFantasyTeam(team["_id"], team);
        await this.playerService.updatePlayer(player["_id"], player);
        return `Added ${player.fullName} to team '${team.name}'`;
    }

    async addTeamToTeam(teamId: number, name: string){
        let team = this.teamservice.getTeamById(teamId);
        let fteam = await this.getTeamByName(name);
        if(team.poolTeam != null){
            return `${team.name} is already apart of a team '${name}'}`
        }
        team.poolTeam = fteam["_id"];
        team.acquisitionDate = new Date("October 13, 2019 11:13:00").toISOString().split('T')[0];
        var teamCopy = Object.assign({}, team)        
        await this.teamservice.getStatsAfterDate(teamCopy["_doc"], teamCopy["_doc"].acquisitionDate);
        fteam.poolPoints += teamCopy["_doc"].poolPoints;
        fteam.teams.push(teamCopy["_doc"]);       
        await this.updateFantasyTeam(fteam["_id"], fteam);
        await this.teamservice.updateTeam(team["_id"], team);
        return `Added ${team.name} to team '${fteam.name}'`;        
    }

    setStatsToZero(y: any){
        y.poolPoints = 0;
        for(let x in y.stats){
            y.stats[x] = 0;
        }
    }

    async saveTeam(fantasyDTO: FantasyDTO): Promise<FantasyDTO>{
        const newFantasy = await this.fantasyTeamModel(fantasyDTO);
        return newFantasy;
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
