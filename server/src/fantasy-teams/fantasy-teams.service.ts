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

    fantasyTeamsPoints(){
        this.teams.forEach(fteam => {
            fteam.players.forEach(p => {
                this.setStatsToZero(p)
                this.playerService.getStatsAfterDate(p, p.acquisitionDate);
                fteam.poolPoints += p.poolPoints;
            });
            fteam.teams.forEach(t => {
                this.setStatsToZero(t); 
                this.teamservice.getStatsAfterDate(t, t.acquisitionDate);
                fteam.poolPoints += t.poolPoints;
            });
        })
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
        player.acquisitionDate = new Date().toISOString().split('T')[0];
        team.players.push(Object.assign({}, player));

        this.fantasyTeamsPoints();
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
        team.acquisitionDate = new Date().toISOString().split('T')[0];
        fteam.teams.push(Object.assign({}, team));
        this.fantasyTeamsPoints();
        return `Added ${team.name} to team '${fteam.name}'`;
    }

    setStatsToZero(y: any){
        y.poolPoints = 0;
        for(let x in y.stats){
            y.stats[x] = 0;
        }
    }
}
