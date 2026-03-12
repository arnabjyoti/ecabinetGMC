import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaArchiveComponent } from './agenda-archive.component';

describe('AgendaArchiveComponent', () => {
  let component: AgendaArchiveComponent;
  let fixture: ComponentFixture<AgendaArchiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaArchiveComponent]
    });
    fixture = TestBed.createComponent(AgendaArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
