import { TestBed } from '@angular/core/testing';

import { CounselorIssueBucketService } from './counselor-issue-bucket.service';

describe('CounselorIssueBucketService', () => {
  let service: CounselorIssueBucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounselorIssueBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
