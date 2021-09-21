import { TestBed } from '@angular/core/testing';

import { PdetailsService } from './pdetails.service';

describe('PdetailsService', () => {
  let service: PdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
