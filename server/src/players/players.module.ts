import { Module, HttpModule, Logger } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TeamsModule } from '../teams/teams.module';
import { RulesModule } from '../rules/rules.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from '../schemas/player.schema';

@Module({
    imports: [HttpModule, TeamsModule, RulesModule, 
              MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema}])],
              
    controllers: [PlayersController],
    providers: [PlayersService],    
    exports: [PlayersService]
})
export class PlayersModule {
}