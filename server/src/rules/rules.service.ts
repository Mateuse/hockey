import { Injectable, OnModuleInit } from '@nestjs/common';
var path = require("path");
import * as fs from 'fs';
import { PointRules, PositionRules } from './rules.interface'

@Injectable()
export class RulesService implements OnModuleInit{
    positionRules: PositionRules;
    pointRules: PointRules;
    constructor(){}

    onModuleInit(){
        //eventual change to db
        this.pointRules = JSON.parse(fs.readFileSync(path.join(__dirname, "../../files/rules.json"), 'utf8'));
        this.positionRules = JSON.parse(fs.readFileSync(path.join(__dirname, "../../files/positionRules.json"), 'utf8'))
    }

    getRules(){
        return this.pointRules;
    }

    getStatsForRules(selectedRules = this.pointRules){
        // this.playersService.getStatsForPlayers()
    }
}
