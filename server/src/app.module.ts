import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RulesModule } from './rules/rules.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { PlayersService } from './players/players.service';
import { TeamsService } from './teams/teams.service';
import { FantasyTeamsModule } from './fantasy-teams/fantasy-teams.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [HttpModule, RulesModule, TeamsModule, PlayersModule, FantasyTeamsModule,
    MongooseModule.forRoot('mongodb://localhost/fantasy', { useNewUrlParser: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly playersService: PlayersService, private readonly teamsService: TeamsService){}
}
