import { Test, TestingModule } from '@nestjs/testing';
import { LiveGamesController } from './live-games.controller';

describe('LiveGames Controller', () => {
  let controller: LiveGamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveGamesController],
    }).compile();

    controller = module.get<LiveGamesController>(LiveGamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
