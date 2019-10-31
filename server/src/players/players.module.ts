import { Module, HttpModule, Logger } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TeamsModule } from '../teams/teams.module';
import { RulesModule } from '../rules/rules.module';

@Module({
    imports: [HttpModule, TeamsModule, RulesModule],
    controllers: [PlayersController],
    providers: [PlayersService],    
    exports: [PlayersService]
})
export class PlayersModule {
}