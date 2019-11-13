import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { FantasyTeam } from './fantasy-team.interface';
var path = require("path");
import * as fs from 'fs';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.interface';

@Injectable()
export class FantasyTeamsService implements OnModuleInit{
    private readonly logger = new Logger(FantasyTeamsService.name);
    teams: Array<FantasyTeam> = []

    constructor(private readonly teamservice: TeamsService, private readonly playerService: PlayersService) {}

    onModuleInit(){
        this.logger.log("Starting FantasyTeamsService")
        this.teams.push(JSON.parse(fs.readFileSync(path.join(__dirname, "../../files/tempTeam.json"), 'utf8')));
    }

    getTeams(){
        return this.teams
    }

    getTeamById(id: number): FantasyTeam{
        let team = null;

        this.teams.forEach(t => {
            if(t.id == id){
                team = t;
                return;
            }
        });

        return team;
    }

    addPlayerToTeam(playerId: number, teamId: number){
        let team = this.getTeamById(teamId);
        let player = this.playerService.getPlayerById(playerId);
        
        if(player.poolTeam != null){
            return `${player.fullName} is already apart of a team '${this.getTeamById(player.poolTeam).name}'`
        }
        player.poolTeam = team.id
        player.acquisitionDate = new Date("October 13, 2019 11:13:00").toISOString().split('T')[0];
        var playerCopy = Object.assign({}, player)
        this.setStatsToZero(playerCopy)
        this.playerService.getStatsAfterDate(playerCopy, playerCopy.acquisitionDate).then(() => {
            team.poolPoints += playerCopy.poolPoints;
            team.players.push(playerCopy);   
        });             
        //add to database once implemented
        return `Added ${player.fullName} to team '${team.name}'`;
    }

    addTeamToTeam(teamId: number, fteamId: number){
        let team = this.teamservice.getTeamById(teamId);
        let fteam = this.getTeamById(fteamId);

        if(team.poolTeam != null){
            return `${team.name} is already apart of a team '${this.getTeamById(team.poolTeam).name}`
        }
        team.poolTeam = fteam.id;
        team.acquisitionDate = new Date("October 13, 2019 11:13:00").toISOString().split('T')[0];
        var teamCopy = Object.assign({}, team)
        this.teamservice.getStatsAfterDate(teamCopy, teamCopy.acquisitionDate).then(() => {
            fteam.poolPoints += teamCopy.poolPoints;
            fteam.teams.push(teamCopy);        
            return `Added ${team.name} to team '${fteam.name}'`;
        });
    }

    setStatsToZero(y: any){
        y.poolPoints = 0;
        for(let x in y.stats){
            y.stats[x] = 0;
        }
    }
}
