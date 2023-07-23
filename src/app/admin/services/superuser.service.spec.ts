import { TestBed } from '@angular/core/testing';

import { SuperuserService } from './superuser.service';

describe('SuperuserService', () => {
  let service: SuperuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
