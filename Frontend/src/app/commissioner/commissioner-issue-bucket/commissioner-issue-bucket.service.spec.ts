import { TestBed } from '@angular/core/testing';

import { CommissionerIssueBucketService } from './commissioner-issue-bucket.service';

describe('CommissionerIssueBucketService', () => {
  let service: CommissionerIssueBucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissionerIssueBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
