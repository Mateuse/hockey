import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from './players.service';
import { Player } from './player.interface';
import { HttpModule } from '@nestjs/common';
import { RulesService } from '../rules/rules.service';
import { PlayerSchema } from '../schemas/player.schema';
import { Model, mockgooseProvider } from 'mongoose'; 
import { getModelToken } from '@nestjs/mongoose';

describe('PlayersService', () => {
  let service: PlayersService;
  let playerModel: Model<Player>;
  const token = getModelToken(PlayerSchema);
  const playerProvider = {
    provide: token,
    useFactory: async connection => connection.model('player', PlayerSchema),
    inject: ['DbConnectionToken'],
  } as any

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [mockgooseProvider, playerProvider, PlayersService, TeamsService, RulesService],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    playerModel = getModelToken(token)
  });

  var player1: Player = { "id": 8473503, 
                          "fullName": "James Reimer", 
                          "team": 1,
                          "stats": null,
                          "link": "/api/v1/people/8473503",
                          "position": "D",
                          "poolPoints": 0,
                          "poolTeam": null,
                          "acquisitionDate": null,
                          "history": null
                        }
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Finds player in json', () => {

    expect(service.getPlayerByName("Reimer")).toEqual([player1]);
    expect(service.getPlayerByName("test")).toEqual("test not found on active rosters");
  })
});
