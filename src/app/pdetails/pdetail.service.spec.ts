import { TestBed } from '@angular/core/testing';

import { PdetailSerive } from './pdetail.service';

describe('PdetailSerive', () => {
  let service: PdetailSerive;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdetailSerive);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
