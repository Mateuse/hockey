import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common/http';
import { RulesService } from '../rules/rules.service';
import { Team } from './team.interface';

@Injectable()
export class TeamsService {
    readonly TEAMSFILE = "./files/teams.json";
    private readonly logger = new Logger(TeamsService.name);
    teams: Array<Team> = [];
    constructor(private readonly http: HttpService, private readonly rulesService: RulesService){}

    getTeams(): any{
        return new Promise((resolve, reject) => {
            this.logger.log("Entered getTeams()");
        try{
                this.http.get("https://statsapi.web.nhl.com/api/v1/teams")
                    .subscribe(
                        res => {
                            for(let x in res.data.teams){
                                var id: Number = res.data.teams[x].id
                                var name: string = res.data.teams[x].name
                                var abbreviation: string = res.data.teams[x].abbreviation
                                var link: string = res.data.teams[x].link
                                var stats: JSON = res.data.teams[x].stats
                                var team: Team = {
                                    "id": id,
                                    "name": name,
                                    "abbreviation": abbreviation,
                                    "link": link,
                                    "stats": stats
                                }
                                this.teams.push(team)
                            }
                            console.log(this.teams)
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
        for(let x in teams){
            console.log(teams)
            if ((teams[x].name).toUpperCase().includes(team.toUpperCase()) || (teams[x].abbreviation).toUpperCase().includes(team.toUpperCase())){
                this.logger.log("Found team " + teams[x].name);
                return teams[x];
            }
        }
        this.logger.log("Couldn't Find " + team );
        return "Couldn't Find " + team;
    }

    getAllTeamsIds(): any{
        this.logger.log("Entered getAllTeamsIds()");
        let ids: Array<Number> = []
        let teams = this.teams;
        for (let x in teams) {
            ids.push(teams[x].id)
        }
        return ids
    }

    getTeamsStats(): any{
        this.logger.log("Entered getTopTeams()")
        for(let x in this.teams){
            this.http.get(`https://statsapi.web.nhl.com/api/v1/teams/${this.teams[x].id}/stats`)
                .subscribe(
                    res => {
                        this.teams[x]["stats"] = res.data.stats[0].splits[0].stat
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

        for(let x in this.teams){
            let points = 0;
            for(let y in this.rulesService.rules["teams"]){
                points += this.teams[x].stats[y] * this.rulesService.rules["teams"][y];
            }
            this.teams[x].stats["poolPoints"] = points;
        }

        return this.teams.sort((a, b) => (a.stats["poolPoints"] > b.stats["poolPoints"] ? -1 : ((b.stats["poolPoints"] > a.stats["poolPoints"]) ? 1 : 0)))
    }
}
