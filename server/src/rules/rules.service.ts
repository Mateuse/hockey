import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class RulesService {
    rules: JSON;
    constructor(){}

    getRules(){
        var rules = fs.readFileSync("../../files/rules.json");
        return rules;
    }
}
