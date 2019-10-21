import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { HttpModule } from '@nestjs/common';
import { PlayersModule } from '../players/players.module';

describe('Teams Controller', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, PlayersModule],
      controllers: [TeamsController],
      providers: [TeamsService]
    }).compile();

    controller = app.get<TeamsController>(TeamsController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
