import { TestBed } from '@angular/core/testing';

import { EventdamageService } from './eventdamage.service';

describe('EventdamageService', () => {
  let service: EventdamageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventdamageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
