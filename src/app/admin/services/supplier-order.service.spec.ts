import { TestBed } from '@angular/core/testing';

import { SupplierOrderService } from './supplier-order.service';

describe('SupplierOrderService', () => {
  let service: SupplierOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
