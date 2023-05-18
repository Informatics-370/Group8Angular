import { TestBed } from '@angular/core/testing';

import { WriteOffReason } from 'src/app/Model/writeOffReason';

describe('WriteORService', () => {
  let service: WriteOffReason;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteOffReason);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
