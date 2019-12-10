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
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleModule } from './schedule/schedule.module';
import { LiveGamesModule } from './live-games/live-games.module';
import { LeagueService } from './league/league.service';
import { LeagueController } from './league/league.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { LeagueModule } from './league/league.module';

@Module({
  imports: [HttpModule, RulesModule, TeamsModule, PlayersModule, FantasyTeamsModule,
    MongooseModule.forRoot('mongodb://localhost/fantasy', { useNewUrlParser: true}),
    ScheduleModule,
    LiveGamesModule,
    AuthenticationModule,
    UsersModule,
    LeagueModule],
  controllers: [AppController, ScheduleController, LeagueController],
  providers: [AppService, ScheduleService, LeagueService, AuthenticationService],
})
export class AppModule {
  constructor(private readonly playersService: PlayersService, private readonly teamsService: TeamsService){}
}
