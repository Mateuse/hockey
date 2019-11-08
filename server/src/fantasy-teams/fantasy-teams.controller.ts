import { Controller, Get } from '@nestjs/common';
import { FantasyTeamsService } from './fantasy-teams.service';

@Controller('fantasy-teams')
export class FantasyTeamsController {

    constructor(private readonly fantasy: FantasyTeamsService){}

    @Get()
    getTeams(){
        this.fantasy.fantasyTeamsPoints();
        return this.fantasy.getTeams();
    }
}
