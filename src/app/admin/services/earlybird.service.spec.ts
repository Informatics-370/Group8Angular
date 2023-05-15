import { TestBed } from '@angular/core/testing';

import { EarlybirdService } from './earlybird.service';

describe('EarlybirdService', () => {
  let service: EarlybirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarlybirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
