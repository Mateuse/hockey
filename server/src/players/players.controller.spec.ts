import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { HttpModule } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';

describe('Players Controller', () => {
  let controller: PlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, TeamsModule],
      controllers: [PlayersController],
      providers: [PlayersService]
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
