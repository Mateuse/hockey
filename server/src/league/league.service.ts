import { Injectable, HttpService } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { League } from './league.interface';
import { LeagueDTO } from './league.dto';
import { RulesService } from '../rules/rules.service';
import { Player } from '../players/player.interface';


@Injectable()
export class LeagueService {

    constructor(private readonly http: HttpService, private readonly teamService: TeamsService, private readonly playerService: PlayersService, 
        private readonly rulesService: RulesService,
        @InjectModel('League') private readonly leagueModel: Model<League>) {}

    async addLeague(league: JSON){

    }

    // async saveLeague(league: LeagueDTO){
    //     const newLeague = await this.leagueModel(league);
    //     return newLeague.save()
    // }

    // async getAllLeagues(): Promise<League[]>{
    //     const leagues = await this.leagueModel.find().exec();
    //     return leagues;
    // }

    // async updateLeague(leagueId, leagueUpdate: LeagueDTO): Promise<LeagueDTO>{
    //     const league = await this.leagueModel.findByIdAndUpdate(leagueId, leagueUpdate);
    //     return league
    // }


}
