import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorIssueBucketComponent } from './counselor-issue-bucket.component';

describe('CounselorIssueBucketComponent', () => {
  let component: CounselorIssueBucketComponent;
  let fixture: ComponentFixture<CounselorIssueBucketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounselorIssueBucketComponent]
    });
    fixture = TestBed.createComponent(CounselorIssueBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
