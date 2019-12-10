import { Module, HttpModule } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';
import { RulesModule } from '../rules/rules.module';
import { PlayersModule } from '../players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';
import { LeagueSchema } from '../schemas/league.schema'

@Module({
    imports: [HttpModule,
            TeamsModule,
            PlayersModule,
            RulesModule,
            MongooseModule.forFeature([{ name: 'League', schema: LeagueSchema}])
    ],
    controllers: [LeagueController],
    providers: [LeagueService],
    exports: [LeagueService]
})
export class LeagueModule {}
