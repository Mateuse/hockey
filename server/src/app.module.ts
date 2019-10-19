import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { TeamsController } from './teams/teams.controller';
import { PlayersController } from './players/players.controller';
import { FantasyTeamsController } from './fantasy-teams/fantasy-teams.controller';
import { FantasyTeamsService } from './fantasy-teams/fantasy-teams.service';
import { RulesController } from './rules/rules.controller';
import { RulesModule } from './rules/rules.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [HttpModule, RulesModule, TeamsModule, PlayersModule],
  controllers: [AppController, TestController, TeamsController, PlayersController, FantasyTeamsController, RulesController],
  providers: [AppService, FantasyTeamsService],
})
export class AppModule {}
