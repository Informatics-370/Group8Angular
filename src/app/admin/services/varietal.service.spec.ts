import { TestBed } from '@angular/core/testing';

import { VarietalService } from './varietal.service';

describe('VarietalService', () => {
  let service: VarietalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VarietalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
