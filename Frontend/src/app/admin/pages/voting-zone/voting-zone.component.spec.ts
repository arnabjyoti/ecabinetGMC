import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingZoneComponent } from './voting-zone.component';

describe('VotingZoneComponent', () => {
  let component: VotingZoneComponent;
  let fixture: ComponentFixture<VotingZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotingZoneComponent]
    });
    fixture = TestBed.createComponent(VotingZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
