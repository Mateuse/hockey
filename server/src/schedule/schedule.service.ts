import { Injectable, HttpService, Logger } from '@nestjs/common';

@Injectable()
export class ScheduleService {
    private readonly logger = new Logger(ScheduleService.name);

    constructor(private readonly http: HttpService){}

    async getGamesToday(){
        var games = [];
        this.logger.log(`entered getGamesToday()`);
        var today = new Date('2019-11-21').toISOString().split('T')[0];
        await this.http.get(`https://statsapi.web.nhl.com/api/v1/schedule?date=${today}`)
            .toPromise().then(res => {
                for(let x in res.data.dates[0].games){
                    games.push(res.data.dates[0].games[x]);
                }
            });
        return games;
    }

    getGameIds(games): Array<number>{
        this.logger.log("entered getGameIds()");
        var ids = [];
        for(let x in games){
            ids.push(games[x]["gamePk"]);
        }
        return ids;
    }
}
