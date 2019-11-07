import { Injectable, OnModuleInit } from '@nestjs/common';
var path = require("path");
import * as fs from 'fs';
import { PlayersService } from '../players/players.service';
import { pathToFileURL } from 'url';

@Injectable()
export class RulesService implements OnModuleInit{
    rules: JSON;
    constructor(){}

    onModuleInit(){
        //weird file stuff going on
        this.rules = JSON.parse(fs.readFileSync(path.join(__dirname, "../../files/rules.json"), 'utf8'));
       
    }

    getRules(){
        return this.rules;
    }

    getStatsForRules(selectedRules = this.rules){
        // this.playersService.getStatsForPlayers()
    }
}
