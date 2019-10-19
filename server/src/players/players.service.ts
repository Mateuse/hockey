import { Injectable, Logger } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service';
import { HttpService } from '@nestjs/common/http';
import * as fs from 'fs';
import { stringify } from 'querystring';
import { map, catchError} from 'rxjs/operators';

@Injectable()
export class PlayersService {
    readonly PLAYERSFILE = "./files/players.json";
    FIRST: boolean = true;
    private players: Array<any> = []
    private readonly logger = new Logger(PlayersService.name);

    constructor(private readonly teamService: TeamsService, private readonly http: HttpService){}

    async getPlayersFromAllTeams(){
        this.logger.log("Entered getPlayersFromAllTeams()");
        let ids = this.teamService.getAllTeamsIds();
        let players = [];
        for(const element of ids){
            await this.http.get(`https://statsapi.web.nhl.com/api/v1/teams/${element}/roster`)
                .subscribe(
                    res => {
                        res.data.roster.forEach(element => {
                            this.players.push(element.person);
                        });    
                    },
                    err => {
                        this.logger.error(err)
                        return stringify(err)
                    }
                )
        }
    }

    savePlayers(): boolean{
        this.logger.log("Entered savePlayers()")
        try{
            fs.writeFileSync(this.PLAYERSFILE, JSON.stringify(this.players));
            return true
        }
        catch(err){
            this.logger.error(`Error saving players to file\n${err}`);
            return false;
        }

    }

    getPlayersFromFile(): any{
        this.logger.log("Entered getPlayersFromFile()");

        try{
            let rawdata = fs.readFileSync(this.PLAYERSFILE);
            let players = JSON.parse(rawdata.toString());
            this.logger.log("Got players from file " + this.PLAYERSFILE);
            return players;
        }
        catch(err){
            this.logger.error(`Error getting players from files ${err}`);
            return null;
        }

    }

    getPlayerByName(player): any{
        this.logger.log("Entered getPlayer()");
        let matches = []
        let players = this.getPlayersFromFile();
        players.forEach(p => {
            if((p.fullName).toUpperCase().includes(player.toUpperCase())){
                matches.push(p);
                this.logger.log(`Found player ${p.fullName}`);
            }
        });
        if(matches.length > 0){
            return matches;
        }
        else{
            this.logger.log(`${player} not found on active rosters`);
            return `${player} not found on active rosters`;
        }        
    }

    getStatsForPlayer(player): any{
        this.logger.log("Entered getStatsForPlayer()");
        let found = this.getPlayerByName(player)[0];
        console.log(found)
        if (typeof(found) !== 'string'){
            this.logger.log(`Sending get request for ${player} stats`);
            return this.http.get(`https://statsapi.web.nhl.com/api/v1/people/${found.id}/stats?stats=statsSingleSeason`)
                .pipe(
                    map(res => res.data.stats[0].splits[0].stat),
                    catchError(err =>{
                        this.logger.error(err);
                        return err;
                    })
                )
        }
        return `${player} not found on active rosters`;
    }
}
