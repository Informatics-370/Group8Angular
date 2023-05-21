import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietalComponent } from './varietal.component';

describe('VarietalComponent', () => {
  let component: VarietalComponent;
  let fixture: ComponentFixture<VarietalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
