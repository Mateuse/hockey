import { TestBed } from '@angular/core/testing';

import { CreateLeagueService } from './create-league.service';

describe('CreateLeagueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateLeagueService = TestBed.get(CreateLeagueService);
    expect(service).toBeTruthy();
  });
});
