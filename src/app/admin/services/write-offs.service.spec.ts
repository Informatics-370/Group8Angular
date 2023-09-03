import { TestBed } from '@angular/core/testing';

import { WriteOffsService } from './write-offs.service';

describe('WriteOffsService', () => {
  let service: WriteOffsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteOffsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
