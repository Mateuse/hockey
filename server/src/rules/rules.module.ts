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
    readonly RULESFILE = "./files/rules.json";
    private readonly logger = new Logger(RulesModule.name);
    rulesJson: JSON;
    constructor(private readonly rulesService: RulesService){}

    onModuleInit(){
        this.logger.log("RulesModule has initialized");
        this.rulesJson = this.getRulesFromFile();
    }

    getRulesFromFile(){
        this.logger.log("Entered getRulesFromFile()");

        try{
            let rawdata = fs.readFileSync(this.RULESFILE);
            let rules = JSON.parse(rawdata.toString());
            this.logger.log("Got rules from file " + this.RULESFILE);
            return rules;
        }
        catch(err){
            this.logger.error(`Error getting rules ${err}`)
            return null;
        }

    }
}