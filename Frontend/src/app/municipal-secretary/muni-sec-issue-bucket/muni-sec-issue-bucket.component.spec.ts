import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuniSecIssueBucketComponent } from './muni-sec-issue-bucket.component';

describe('MuniSecIssueBucketComponent', () => {
  let component: MuniSecIssueBucketComponent;
  let fixture: ComponentFixture<MuniSecIssueBucketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MuniSecIssueBucketComponent]
    });
    fixture = TestBed.createComponent(MuniSecIssueBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
