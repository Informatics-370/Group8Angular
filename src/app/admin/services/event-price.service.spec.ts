import { TestBed } from '@angular/core/testing';

import { EventPriceService } from './event-price.service';

describe('EventPriceService', () => {
  let service: EventPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
