import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRefundsComponent } from './my-refunds.component';

describe('MyRefundsComponent', () => {
  let component: MyRefundsComponent;
  let fixture: ComponentFixture<MyRefundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRefundsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRefundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
