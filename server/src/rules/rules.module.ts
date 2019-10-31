import { Module, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
    controllers: [RulesController],
    providers: [RulesService],
    exports: [RulesService]
})
export class RulesModule {    
    constructor(private readonly rulesService: RulesService){}
}