import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpResourcesComponent } from './help-resources.component';

describe('HelpResourcesComponent', () => {
  let component: HelpResourcesComponent;
  let fixture: ComponentFixture<HelpResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpResourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
