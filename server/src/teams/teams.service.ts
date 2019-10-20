import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common/http';
import * as fs from 'fs';
import { PlayersService } from '../players/players.service';
import { resolve } from 'dns';
import { VirtualTimeScheduler } from 'rxjs';

@Injectable()
export class TeamsService {
    readonly TEAMSFILE = "./files/teams.json";
    private readonly logger = new Logger(TeamsService.name);
    teams: Array<any> = [];
    constructor(private readonly http: HttpService){}

    getTeams(): any{
        return new Promise((resolve, reject) => {
            this.logger.log("Entered getTeams()");
        try{
                this.http.get("https://statsapi.web.nhl.com/api/v1/teams")
                    .subscribe(
                        res => {
                            this.teams.push(res.data.teams);
                            this.logger.log("Saved teams to var")
                            resolve(res);
                        },
                        err => {
                            reject(JSON.stringify(err))
                        }
                    )          
        }
        catch{
            reject("error in http request for https://statsapi.web.nhl.com/api/v1/teams")
        } 
        })       
    }   

    getTeam(team: String): any{
        this.logger.log("Entered getTeam()");
        let teams = this.teams; 
        for(let x in teams[0]){
            if ((teams[0][x].name).toUpperCase().includes(team.toUpperCase()) || (teams[0][x].abbreviation).toUpperCase().includes(team.toUpperCase())){
                this.logger.log("Found team " + teams[0][x].name);
                return teams[0][x];
            }
        }
        this.logger.log("Couldn't Find " + team );
        return "Couldn't Find " + team;
    }

    getAllTeamsIds(): any{
        this.logger.log("Entered getAllTeamsIds()");
        let ids: Array<Number> = []
        let teams = this.teams;
        for (let x in teams[0]) {
            ids.push(teams[0][x].id)
        }
        return ids
    }

}
