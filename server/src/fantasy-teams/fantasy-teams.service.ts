import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { FantasyTeam } from './fantasy-team.interface';
var path = require("path");
import * as fs from 'fs';

@Injectable()
export class FantasyTeamsService implements OnModuleInit{
    private readonly logger = new Logger(FantasyTeamsService.name);
    teams: Array<FantasyTeam> = []

    constructor() {}

    onModuleInit(){
        this.logger.log("Starting FantasyTeamsService")
        this.teams.push(JSON.parse(fs.readFileSync(path.join(__dirname, "../../files/tempTeam.json"), 'utf8')));
        this.logger.debug(this.teams)
    }
}
