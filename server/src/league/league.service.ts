import { Injectable, HttpService, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { League } from './league.interface';
import { PlayersService } from '../players/players.service';
import { RulesService } from '../rules/rules.service';
import { FantasyTeamsService } from '../fantasy-teams/fantasy-teams.service';
import { LeagueDTO } from './league.dto';

@Injectable()
export class LeagueService {
    private readonly logger = new Logger(LeagueService.name);

    constructor(private readonly httpService: HttpService, private readonly playersService: PlayersService, private readonly fantasyTeamsService: FantasyTeamsService,
        private readonly rulesService: RulesService,
        @InjectModel('League') private readonly leagueModel: Model<League>){}

    
    async addLeague(league: any){
        this.logger.debug(league);
    }

    async saveLeague(LeagueDTO: LeagueDTO): Promise<League>{
        const newLeague = await this.leagueModel(LeagueDTO);
        return newLeague.save();
    }

    async getAllLeagues(): Promise<League[]>{
        const leagues = await this.leagueModel.find().exec();
        return leagues;
    }

    async updateLeague(leagueId, leageUpdate: LeagueDTO): Promise<League>{
        const league = await this.leagueModel.findByIdAndUpdate(leagueId, leageUpdate);
        return league;
    }

    async getLeague(leagueId): Promise<League>{
        const league = await this.leagueModel.findById(leagueId);
        return league;
    }
}
