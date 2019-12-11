import { Module, HttpModule} from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueSchema } from '../schemas/league.schema';
import { PlayersModule } from '../players/players.module';
import { FantasyTeamsModule } from '../fantasy-teams/fantasy-teams.module';
import { RulesModule } from '../rules/rules.module'

@Module({
  imports:[HttpModule, PlayersModule, FantasyTeamsModule, RulesModule,
    MongooseModule.forFeature([{name: 'League', schema: LeagueSchema}])],
  providers: [LeagueService],
  controllers: [LeagueController],
  exports: [LeagueService]
})
export class LeagueModule {}
