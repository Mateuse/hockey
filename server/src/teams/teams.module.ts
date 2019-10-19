import { Module, HttpModule, Logger } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
    imports: [HttpModule],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService]
})
export class TeamsModule {
    teams: any
    private readonly logger = new Logger(TeamsModule.name);
    constructor(private readonly teamsService: TeamsService){

    }
}
