import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorIssueBucketComponent } from './mayor-issue-bucket.component';

describe('MayorIssueBucketComponent', () => {
  let component: MayorIssueBucketComponent;
  let fixture: ComponentFixture<MayorIssueBucketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MayorIssueBucketComponent]
    });
    fixture = TestBed.createComponent(MayorIssueBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
