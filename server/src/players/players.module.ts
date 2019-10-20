import { Module, HttpModule, Logger } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TeamsModule } from '../teams/teams.module';
import { TeamsService } from '../teams/teams.service';

@Module({
    imports: [HttpModule, TeamsModule],
    controllers: [PlayersController],
    providers: [PlayersService],    
    exports: [PlayersService]
})
export class PlayersModule {
}