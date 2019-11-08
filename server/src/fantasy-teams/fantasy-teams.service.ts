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
}
