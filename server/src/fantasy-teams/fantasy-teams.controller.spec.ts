import { Test, TestingModule } from '@nestjs/testing';
import { FantasyTeamsController } from './fantasy-teams.controller';

describe('FantasyTeams Controller', () => {
  let controller: FantasyTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FantasyTeamsController],
    }).compile();

    controller = module.get<FantasyTeamsController>(FantasyTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
