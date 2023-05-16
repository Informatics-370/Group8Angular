import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemprivilegesComponent } from './systemprivileges.component';

describe('SystemprivilegesComponent', () => {
  let component: SystemprivilegesComponent;
  let fixture: ComponentFixture<SystemprivilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemprivilegesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemprivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
