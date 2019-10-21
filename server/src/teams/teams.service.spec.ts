import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { HttpModule } from '@nestjs/common';
import { PlayersModule } from 'src/players/players.module';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [TeamsService],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

   var json = [[{"id":1,"name":"New Jersey Devils","link":" / api / v1 / teams / 1","venue":{"name":"Prudential Center","link":" / api / v1 / venues / null","city":"Newark","timeZone":{"id":"America / New_York","offset":-4,"tz":"EDT"}},"abbreviation":"NJD","teamName":"Devils","locationName":"New Jersey","firstYearOfPlay":"1982","division":{"id":18,"name":"Metropolitan","nameShort":"Metro","link":" / api / v1 / divisions / 18","abbreviation":"M"},"conference":{"id":6,"name":"Eastern","link":" / api / v1 / conferences / 6"},"franchise":{"franchiseId":23,"teamName":"Devils","link":" / api / v1 / franchises / 23"},"shortName":"New Jersey","officialSiteUrl":"http://www.newjerseydevils.com/","franchiseId":23,"active":true}]];

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Finds team in json', () => {
    service.teams = json;

    expect(service.getTeam("Devils").abbreviation).toEqual('NJD')
    expect(service.getTeam("test")).toEqual("Couldn't Find test")
  });

  it('Returns all teams ids', () => {
    var ids = [1];
    service.teams = json;
    expect(service.getAllTeamsIds()).toEqual(ids)
  });
});
