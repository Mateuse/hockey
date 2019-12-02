import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from './players.service';
import { Player } from './player.interface';
import { HttpModule } from '@nestjs/common';
import { RulesService } from '../rules/rules.service';
import { PlayerSchema } from '../schemas/player.schema';
import { Model, mockgooseProvider } from 'mongoose'; 
import { getModelToken } from '@nestjs/mongoose';
import { PlayersController } from './players.controller';
jest.mock("../teams/teams.service");
jest.mock("../rules/rules.service");

describe('PlayersService', () => {
  let playerService: PlayersService;
  let teamsService: TeamsService;
  let rulesService: RulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PlayersController],
      providers: [PlayersService, TeamsService, RulesService,
                {
                  provide: getModelToken("Player"),
                  useValue: PlayerSchema
                }],
    }).compile();

    playerService = module.get<PlayersService>(PlayersService);
    teamsService = module.get<TeamsService>(TeamsService);
    rulesService = module.get<RulesService>(RulesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

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
    expect(playerService).toBeDefined();
  });

  it('Finds player in json', () => {

    expect(playerService.getPlayerByName("Reimer")).toEqual([player1]);
    expect(playerService.getPlayerByName("test")).toEqual("test not found on active rosters");
  })
});
