import { TestBed } from '@angular/core/testing';

import { WinetypeService } from './winetype.service';

describe('WinetypeService', () => {
  let service: WinetypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WinetypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
