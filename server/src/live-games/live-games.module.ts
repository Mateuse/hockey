import { Module, HttpModule } from '@nestjs/common';
import { LiveGamesService } from './live-games.service';
import { LiveGamesController } from './live-games.controller';
import { PlayersModule } from '../players/players.module';
import { TeamsModule } from '../teams/teams.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [HttpModule, PlayersModule, TeamsModule, ScheduleModule],
  providers: [LiveGamesService],
  controllers: [LiveGamesController],
  exports: [LiveGamesService]
})
export class LiveGamesModule {}
