import { Module, HttpModule} from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueSchema } from '../schemas/league.schema';
import { PlayersModule } from '../players/players.module';
import { FantasyTeamsModule } from '../fantasy-teams/fantasy-teams.module';
import { UsersModule } from '../users/users.module'

@Module({
  imports:[HttpModule, PlayersModule, FantasyTeamsModule, UsersModule,
    MongooseModule.forFeature([{name: 'League', schema: LeagueSchema}])],
  providers: [LeagueService],
  controllers: [LeagueController],
  exports: [LeagueService]
})
export class LeagueModule {}
