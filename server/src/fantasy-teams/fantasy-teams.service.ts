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

    getTeams(){
        return this.teams
    }

    getTeamById(id: string): FantasyTeam{
        this.logger.log(`Entered getTeamById() for  id ${id}`)
        let team = null;
        this.teams.forEach(t => {
            if(t["_id"] == id){
                team = t;
                return;
            }
        });
        return team;
    }

    getTeamByName(name: string): FantasyTeam{
        this.logger.log(`Entered getTeamByName() for name ${name}`)
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
        if(this.getTeam(name).name == name){
            return `Name ${name} already exitsts in pool`;
        }
        var fTeam: FantasyTeam = {
            "name": name,
            "players": [],
            "teams": [],
            "poolPoints": 0 
        }
        
        this.teams.push(fTeam);
        return await this.saveTeam(fTeam);
    }

    getTeam(name: string){
        this.logger.log(`entered getTeam() for ${name}`);
        for (let x in this.teams) {
            if (this.teams[x].name == name) {
                return this.teams[x];
            }
        }
        var team: FantasyTeam = {
            "name": "",
            "players": [],
            "teams": [],
            "poolPoints": 0  
        }

        return team;
    }

    async addPlayerToTeam(playerId: number, name: string){
        this.logger.log(`entered addPlayerToTeam for playerID ${playerId} and teamId ${name}`)
        let team = this.getTeamByName(name);
        let player = await this.playerService.getPlayerById(playerId);
 
        if(player.poolTeam != null){
            return `${player.fullName} is already apart of a team '${this.getTeamById(player.poolTeam).name}'`
        }

        player.poolTeam = team["id"]
        player.acquisitionDate = new Date().toISOString().split('T')[0];
        var playerCopy = await Object.assign({}, player)
        this.setStatsToZero(playerCopy["_doc"]);
        await this.playerService.getStatsAfterDate(playerCopy["_doc"], playerCopy["_doc"].acquisitionDate)

        team.poolPoints += playerCopy["_doc"].poolPoints;        
        team.players.push(playerCopy["_doc"]);
        await this.updateFantasyTeam(team["id"], team);
        await this.playerService.updatePlayer(player["_id"], player);
        return `Added ${player.fullName} to team '${team.name}'`;
    }

    async addTeamToTeam(teamId: number, name: string){
        this.logger.log(`entered addTeamToTeam for teamId ${teamId} and team name ${name}`)
        let team = this.teamservice.getTeamById(teamId);
        let fteam = await this.getTeamByName(name);

        if(team.poolTeam != null){
            return `${team.name} is already apart of a team '${this.getTeamById(team.poolTeam).name}'}`
        }
        team.poolTeam = fteam["id"];
        team.acquisitionDate = new Date().toISOString().split('T')[0];
        var teamCopy = Object.assign({}, team)  
        this.setStatsToZero(teamCopy["_doc"])      ;
        await this.teamservice.getStatsAfterDate(teamCopy["_doc"], teamCopy["_doc"].acquisitionDate);
        fteam.poolPoints += teamCopy["_doc"].poolPoints;
        fteam.teams.push(teamCopy["_doc"]);       
        await this.updateFantasyTeam(fteam["id"], fteam);
        await this.teamservice.updateTeam(team["_id"], team);
        return `Added ${team.name} to team '${fteam.name}'`;        
    }

    setStatsToZero(y: any){
        this.logger.log(`entered setStatsToZero() for ${y.id}`)
        y.poolPoints = 0;
        for(let x in y.stats){
            y.stats[x] = 0;
        }
    }

    async trade(tradeObject: any){
        this.logger.log(`entered trade() for ${tradeObject}`);
        let fteam1 = this.getTeamByName(tradeObject["fteam1"]);
        let fteam2 = this.getTeamByName(tradeObject["fteam2"]);
        if(fteam1 == null || fteam2 == null){
            return `A team does not exist`;
        }
        for (let x in tradeObject["fteam1PlayerPackage"]) {
            let p = this.playerService.getPlayerById(tradeObject["fteam1PlayerPackage"][x]);
            if (fteam1["_id"] != p.poolTeam) {
                return `Error in trade, ${p.fullName} does not exist in team ${fteam1.name}`;
            }
            fteam1.players.splice(fteam1.players.indexOf(p));
            p.poolTeam = fteam2["_id"];
            fteam2.players.push(p);
            this.playerService.updatePlayer(p["_id"], p);            
        }
        for (let x in tradeObject["fteam1TeamPackage"]) {
            let t = this.teamservice.getTeamById(tradeObject["fteam1TeamPackage"][x])
            if (fteam1["_id"] != t.poolTeam) {
                return `Error in trade, ${t.name} does not exist in team ${fteam1.name}`;

            }
            fteam1.teams.splice(fteam1.teams.indexOf(t))
            t.poolTeam = fteam2["_id"];
            fteam2.teams.push(t);
            this.teamservice.updateTeam(t["_id"], t);
        }

        for (let x in tradeObject["fteam2PlayerPackage"]) {
            let p = this.playerService.getPlayerById(tradeObject["fteam2PlayerPackage"][x]);
            if (fteam2["_id"] != p.poolTeam) {
                return `Error in trade, ${p.fullName} does not exist in team ${fteam2.name}`;
            }
            fteam2.players.splice(fteam2.players.indexOf(p));
            p.poolTeam = fteam1["_id"];
            fteam1.players.push(p);
            this.playerService.updatePlayer(p["_id"], p);
        }

        for (let x in tradeObject["fteam2TeamPackage"]) {
            let t = this.teamservice.getTeamById(tradeObject["fteam2TeamPackage"][x])
            if (fteam2["_id"] != t.poolTeam) {
                return `Error in trade, ${t.name} does not exist in team ${fteam2.name}`;
            }
            fteam2.teams.splice(fteam2.teams.indexOf(t))
            t.poolTeam = fteam1["_id"]     
            fteam1.teams.push(t);
            this.teamservice.updateTeam(t["_id"], t);       
        }
        await this.updateFantasyTeam(fteam1["_id"], fteam1);
        await this.updateFantasyTeam(fteam2["_id"], fteam2);
        return `Success trading ${JSON.stringify(tradeObject)}`;
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
