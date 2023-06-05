import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPriceComponent } from './event-price.component';

describe('EventPriceComponent', () => {
  let component: EventPriceComponent;
  let fixture: ComponentFixture<EventPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
