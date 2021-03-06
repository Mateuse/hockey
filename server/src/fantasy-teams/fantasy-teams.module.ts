import { Module } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';
import { PlayersModule } from '../players/players.module';
import { FantasyTeamsService } from './fantasy-teams.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FantasyTeamSchema } from '../schemas/fantasy-team.schema';


@Module({
    imports: [TeamsModule, PlayersModule,
        MongooseModule.forFeature([{ name: 'FantasyTeam', schema: FantasyTeamSchema }])],
    providers: [FantasyTeamsService],
    exports: [FantasyTeamsService]
})
export class FantasyTeamsModule {}
