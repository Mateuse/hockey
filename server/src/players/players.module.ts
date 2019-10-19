import { Module, HttpModule, Logger } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
    imports: [HttpModule],
    controllers: [PlayersController],
    providers: [PlayersService],
    exports: [PlayersService]
})
export class PlayersModule {
    private readonly logger = new Logger(PlayersModule.name);
    constructor(private readonly playersService: PlayersService){}

    onModuleInit(){
        this.logger.log("Players module has started");
        this.playersService.getPlayersFromFile();
    }
}
