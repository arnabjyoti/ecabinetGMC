import { TestBed } from '@angular/core/testing';

import { VotePageService } from './vote-page.service';

describe('VotePageService', () => {
  let service: VotePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
