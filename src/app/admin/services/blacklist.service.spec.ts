import { TestBed } from '@angular/core/testing';

import { BlacklistService } from './blacklist.service';

describe('WineService', () => {
  let service: BlacklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlacklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
