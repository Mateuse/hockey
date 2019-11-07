import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common/http';
import { RulesService } from '../rules/rules.service';

@Injectable()
export class TeamsService {
    readonly TEAMSFILE = "./files/teams.json";
    private readonly logger = new Logger(TeamsService.name);
    teams: Array<any> = [];
    constructor(private readonly http: HttpService, private readonly rulesService: RulesService){}

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
            console
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

    getTeamsStats(): any{
        this.logger.log("Entered getTopTeams()")
        for(let x in this.teams[0]){
            this.http.get(`https://statsapi.web.nhl.com/api/v1/teams/${this.teams[0][x].id}/stats`)
                .subscribe(
                    res => {
                        this.teams[0][x]["stats"] = res.data.stats[0].splits[0].stat
                    },
                    err => {
                        this.logger.error(err);
                        return err
                    }
                )
        }
    }

    topTeams(){
        this.logger.log("Entered topTeams()");

        for(let x in this.teams[0]){
            let points = 0;
            for(let y in this.rulesService.rules["teams"]){
                points += this.teams[0][x].stats[y] * this.rulesService.rules["teams"][y];
            }
            this.teams[0][x].stats["poolPoints"] = points;
        }

        return this.teams[0].sort((a, b) => (a.stats["poolPoints"] > b.stats["poolPoints"] ? -1 : ((b.stats["poolPoints"] > a.stats["poolPoints"]) ? 1 : 0)))
    }
}
