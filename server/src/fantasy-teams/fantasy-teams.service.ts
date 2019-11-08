import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { FantasyTeam } from './fantasy-team.interface';
var path = require("path");
import * as fs from 'fs';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';

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
                let player = this.playerService.getPlayerById(p);
                fteam.poolPoints += player.poolPoints;
            });
            fteam.teams.forEach(t => {
                let team = this.teamservice.getTeamById(t);
                fteam.poolPoints += team.poolPoints;
            })
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
        team.players.push(player.id);
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
        fteam.teams.push(team.id);

        return `Added ${team.name} to team '${fteam.name}'`;
    }
}
