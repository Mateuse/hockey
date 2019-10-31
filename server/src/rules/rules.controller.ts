import { Controller, Get } from '@nestjs/common';
import { RulesService } from './rules.service';

@Controller('rules')
export class RulesController {

    constructor(private readonly rulesService: RulesService){}

    @Get("/rules")
    getRules(){
        return this.rulesService.getRules();
    }
}
