import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerIssueBucketComponent } from './commissioner-issue-bucket.component';

describe('CommissionerIssueBucketComponent', () => {
  let component: CommissionerIssueBucketComponent;
  let fixture: ComponentFixture<CommissionerIssueBucketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionerIssueBucketComponent]
    });
    fixture = TestBed.createComponent(CommissionerIssueBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
