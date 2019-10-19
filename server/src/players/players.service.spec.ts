import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from './players.service';
import { HttpService, HttpModule, INestApplication } from '@nestjs/common';


describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PlayersService, TeamsService],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  var json = [{ "id": 8473503, "fullName": "James Reimer", "link": "/api/v1/people/8473503" }, { "id": 8473533, "fullName": "Jordan Staal", "link": "/api/v1/people/8473533" }, { "id": 8474581, "fullName": "Jake Gardiner", "link": "/api/v1/people/8474581" }]
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Finds player in json', () => {
    spyOn(service, 'getPlayersFromFile').and.returnValue(json);

    expect(service.getPlayerByName("Reimer")).toEqual([json[0]]);
    expect(service.getPlayerByName("test")).toEqual("test not found on active rosters");
  })
});
