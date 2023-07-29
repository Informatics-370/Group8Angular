import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRefundsComponent } from './user-refunds.component';

describe('UserRefundsComponent', () => {
  let component: UserRefundsComponent;
  let fixture: ComponentFixture<UserRefundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRefundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
