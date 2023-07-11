import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSidenavComponent } from './customer-sidenav.component';

describe('CustomerSidenavComponent', () => {
  let component: CustomerSidenavComponent;
  let fixture: ComponentFixture<CustomerSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
