import { TestBed } from '@angular/core/testing';

import { SystemprivilegeService } from './systemprivilege.service';

describe('SystemprivilegeService', () => {
  let service: SystemprivilegeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemprivilegeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
