import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameAndPasswordComponent } from './username-and-password.component';

describe('UsernameAndPasswordComponent', () => {
  let component: UsernameAndPasswordComponent;
  let fixture: ComponentFixture<UsernameAndPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsernameAndPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameAndPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
