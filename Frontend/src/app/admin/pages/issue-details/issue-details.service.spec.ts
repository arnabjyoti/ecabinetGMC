import { TestBed } from '@angular/core/testing';

import { IssueDetailsService } from './issue-details.service';

describe('IssueDetailsService', () => {
  let service: IssueDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
