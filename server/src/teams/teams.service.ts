import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common/http';
import { stringify } from '@angular/compiler/src/util';
import * as fs from 'fs';

@Injectable()
export class TeamsService {
    readonly TEAMSFILE = "./files/teams.json";
    private readonly logger = new Logger(TeamsService.name);
    teams: any;
    constructor(private readonly http: HttpService){}

    getTeams(): any{
        this.logger.log("Entered getTeams()");
        try{
                this.http.get("https://statsapi.web.nhl.com/api/v1/teams")
                    .subscribe(
                        res => {
                            this.saveTeams(res.data);
                            this.logger.log("Saved teams to file")
                        },
                        err => {
                            this.logger.error(err)
                            return stringify(err);
                        }
                    )          
        }
        catch{
            return "Something went wrong";
        }        
    }   

    private saveTeams(teamList): boolean{
        this.logger.log("Entered saveTeams()");
        try{
            fs.writeFileSync(this.TEAMSFILE, JSON.stringify(teamList.teams));
            this.logger.log("Saved Teams to Files");
            return true;
        }
        catch{
            this.logger.error("Error saving teams to file");
            return false;
        }
    }

    getTeamsFromFile(): any{
        this.logger.log("Entered getTeamsFromFile()")

        try{
            let rawdata = fs.readFileSync(this.TEAMSFILE);
            let teams = JSON.parse(rawdata.toString());
            this.logger.log("Got teams from file " + this.TEAMSFILE);
            this.teams = teams;
            return teams
        }
        catch(err){
            this.logger.error(`Error getting teams from files ${err}`);
            return false;
        }
    }

    getTeam(team: String): any{
        this.logger.log("Entered getTeam()");

        let teams = this.teams;     
        for(let x in teams){
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

}
