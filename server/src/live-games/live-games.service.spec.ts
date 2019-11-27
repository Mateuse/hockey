import { Test, TestingModule } from '@nestjs/testing';
import { LiveGamesService } from './live-games.service';

describe('LiveGamesService', () => {
  let service: LiveGamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveGamesService],
    }).compile();

    service = module.get<LiveGamesService>(LiveGamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
