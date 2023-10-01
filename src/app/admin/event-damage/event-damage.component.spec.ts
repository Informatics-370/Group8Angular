import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDamageComponent } from './event-damage.component';

describe('EventDamageComponent', () => {
  let component: EventDamageComponent;
  let fixture: ComponentFixture<EventDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDamageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
