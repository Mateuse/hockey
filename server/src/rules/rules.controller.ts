import { Controller, Get } from '@nestjs/common';
import { RulesService } from './rules.service';
import { PlayersService } from '../players/players.service';

@Controller('rules')
export class RulesController {

    constructor(private readonly rulesService: RulesService){}

    @Get("")
    getRules(){
        return this.rulesService.getRules();
    }
}
