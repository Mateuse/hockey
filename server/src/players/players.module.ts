import { Module, HttpModule, Logger } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TeamsModule } from '../teams/teams.module';

@Module({
    imports: [HttpModule, TeamsModule],
    controllers: [PlayersController],
    providers: [PlayersService],
    exports: [PlayersService]
})
export class PlayersModule {
    private readonly logger = new Logger(PlayersModule.name);
    constructor(private readonly playersService: PlayersService){}
}
