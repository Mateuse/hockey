import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/common/http';
import { RulesService } from '../rules/rules.service';
import { Team } from './team.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamDTO } from './team.dto';

@Injectable()
export class TeamsService {
    private readonly logger = new Logger(TeamsService.name);
    private statsFields: Array<string> = ["wins", "losses", "ot"]
    teams: Array<Team> = [];
    constructor(private readonly http: HttpService, private readonly rulesService: RulesService,
                @InjectModel('Team') private readonly teamModel: Model<Team>){}
    
    async getTeams(): Promise<any>{
        this.teams = await this.getAllTeams();
        if(this.teams.length == 0){
            await this.getTeamsApi();
            this.teams = await this.getAllTeams();
        }
    }
    
    async getTeamsApi(): Promise<any>{
            this.logger.log("Entered getTeams()");
        try{
                await this.http.get("https://statsapi.web.nhl.com/api/v1/teams")
                    .toPromise()
                        .then(async res => {
                            for(let x in res.data.teams){
                                var id: number = res.data.teams[x].id
                                var name: string = res.data.teams[x].name
                                var abbreviation: string = res.data.teams[x].abbreviation
                                var link: string = res.data.teams[x].link
                                var stats: JSON = res.data.teams[x].stats
                                var team: Team = {
                                    "id": id,
                                    "name": name,
                                    "abbreviation": abbreviation,
                                    "link": link,
                                    "stats": stats,
                                    "poolPoints": 0,
                                    "poolTeam": null,
                                    "acquisitionDate": null
                                }
                                await this.saveTeam(team);
                            }
                            
                            this.logger.debug("Saved teams to var")      
                        }
                    )          
        }
        catch{
            console.log("error in http request for https://statsapi.web.nhl.com/api/v1/teams")
        }       
    }   

    getTeam(team: String): Team{
        this.logger.log("Entered getTeam()");
        let teams = this.teams; 
        for(let x in teams){
            if ((teams[x].name).toUpperCase().includes(team.toUpperCase()) || (teams[x].abbreviation).toUpperCase().includes(team.toUpperCase())){
                this.logger.log("Found team " + teams[x].name);
                return teams[x];
            }
        }
        this.logger.log("Couldn't Find " + team );
        return null;
    }

    getTeamById(id: number): Team{
        let match = null;
        this.teams.forEach(t => {
            if(t.id == id){
                match = t;
                return;
            }
        });
        return match
    }

    getAllTeamsIds(): any{
        this.logger.log("Entered getAllTeamsIds()");
        let ids: Array<number> = []
        let teams = this.teams;
        for (let x in teams) {
            ids.push(teams[x].id)
        }
        return ids
    }

    async getTeamsStats(): Promise<any>{
        this.logger.log("Entered getTeamsStats()")
        for(let x in this.teams){
            await this.http.get(`https://statsapi.web.nhl.com/api/v1/teams/${this.teams[x].id}/stats`)
                .toPromise().then(
                    res => {
                        this.teams[x].stats = res.data.stats[0].splits[0].stat                      
                        this.teams[x].poolPoints = this.getPoolPoints(this.teams[x].stats)
                        this.updateTeam(this.teams[x]["_id"], this.teams[x]);
                    },
                    err => {
                        this.logger.error(err);
                        return err
                    }
                )
        }
    }

    async getStatsAfterDate(team: Team, date): Promise<any>{
        this.logger.log(`Entered get stats after date ${date} for team ${team.name} `)
            await this.http.get(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${team.id}&startDate=${date}&endDate=${new Date().toISOString().split('T')[0]}`)
                .toPromise().then(res => {
                        if(res.data.dates[0]){
                            let prevStats = {}
                            for(let x in res.data.dates[0].games[0].teams){
                                if (res.data.dates[0].games[0].teams[x].team.name == team.name){
                                    prevStats = res.data.dates[0].games[0].teams[x].leagueRecord;
                                }
                            }
                            this.logger.debug(prevStats);
                            var currentStats = this.getTeamById(team.id);

                            for (let i in this.statsFields) {
                                team.stats[i] = currentStats.stats[i] - prevStats[i];
                            }
                            team.poolPoints = this.getPoolPoints(team.stats);                   
                        }                        
                    });
            }
   

    topTeams(){
        this.logger.log("Entered topTeams()");
        return this.teams.sort((a, b) => (a.poolPoints > b.poolPoints ? -1 : ((b.poolPoints > a.poolPoints) ? 1 : 0)))
    }

    getPoolPoints(stats): number{
        let points = 0;
        for(let x in this.rulesService.pointRules.teams){
            points += stats[x] * this.rulesService.pointRules.teams[x]
        }
        return points;
    }

    async saveTeam(teamDTO: TeamDTO): Promise<Team>{
        const newTeam = await this.teamModel(teamDTO);
        return newTeam.save();
    }

    async getAllTeams(): Promise<Team[]>{
        const teams = await this.teamModel.find();
        return teams;
    }

    async updateTeam(teamId, teamUpdate: TeamDTO): Promise<Team> {
        const team = await this.teamModel.findByIdAndUpdate(teamId, teamUpdate, { useFindAndModify: false})
        return team;
    }
}
