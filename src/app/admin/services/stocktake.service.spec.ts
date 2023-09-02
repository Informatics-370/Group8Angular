import { TestBed } from '@angular/core/testing';

import { StocktakeService } from './stocktake.service';

describe('StocktakeService', () => {
  let service: StocktakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocktakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
