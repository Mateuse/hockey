import { Test, TestingModule } from '@nestjs/testing';
import { FantasyTeamsService } from './fantasy-teams.service';

describe('FantasyTeamsService', () => {
  let service: FantasyTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FantasyTeamsService],
    }).compile();

    service = module.get<FantasyTeamsService>(FantasyTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
