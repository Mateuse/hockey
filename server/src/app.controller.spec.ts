import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { RulesModule } from './rules/rules.module';
import { FantasyTeamsModule } from './fantasy-teams/fantasy-teams.module';
import { AppModule } from './app.module';
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleModule } from './schedule/schedule.module';
import { LiveGamesModule } from './live-games/live-games.module';
import { HttpModule } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule, PlayersModule, TeamsModule, RulesModule, FantasyTeamsModule, ScheduleModule, LiveGamesModule],
      controllers: [AppController],
      providers: [AppService, ScheduleService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should be defined', () =>{
      expect(appController).toBeDefined();
    })
  });
});
