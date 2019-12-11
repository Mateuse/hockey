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
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleModule } from './schedule/schedule.module';
import { LiveGamesModule } from './live-games/live-games.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { LeagueModule } from './league/league.module';

@Module({
  imports: [HttpModule, RulesModule, TeamsModule, PlayersModule, FantasyTeamsModule,
    MongooseModule.forRoot('mongodb://localhost/fantasy', { useNewUrlParser: true}),
    ScheduleModule,
    LiveGamesModule,
    AuthenticationModule,
    UsersModule,
    LeagueModule
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleService, AuthenticationService],
})
export class AppModule {
  constructor(private readonly playersService: PlayersService, private readonly teamsService: TeamsService){}
}
