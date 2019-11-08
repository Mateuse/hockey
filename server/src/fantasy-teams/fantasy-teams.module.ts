import { Module } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';
import { PlayersModule } from '../players/players.module';
import { FantasyTeamsController } from './fantasy-teams.controller';
import { FantasyTeamsService } from './fantasy-teams.service';

@Module({
    imports: [TeamsModule, PlayersModule],
    controllers: [FantasyTeamsController],
    providers: [FantasyTeamsService],
    exports: [FantasyTeamsService]
})
export class FantasyTeamsModule {}
