import { TestBed } from '@angular/core/testing';

import { MayorIssueBucketService } from './mayor-issue-bucket.service';

describe('MayorIssueBucketService', () => {
  let service: MayorIssueBucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayorIssueBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
