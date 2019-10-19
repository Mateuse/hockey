import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

describe('Teams Controller', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [TeamsService]
    }).compile();

    controller = app.get<TeamsController>(TeamsController);
  });

});
