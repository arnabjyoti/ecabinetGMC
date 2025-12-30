import { TestBed } from '@angular/core/testing';

import { VotingZoneService } from './voting-zone.service';

describe('VotingZoneService', () => {
  let service: VotingZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotingZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
