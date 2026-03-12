import { TestBed } from '@angular/core/testing';

import { AgendaArchiveService } from './agenda-archive.service';

describe('AgendaArchiveService', () => {
  let service: AgendaArchiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaArchiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
