import { TestBed } from '@angular/core/testing';

import { MuniSecIssueBucketService } from './muni-sec-issue-bucket.service';

describe('MuniSecIssueBucketService', () => {
  let service: MuniSecIssueBucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuniSecIssueBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
