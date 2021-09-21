import { TestBed } from '@angular/core/testing';

import { VcustomizerService } from './vcustomizer.service';

describe('VcustomizerService', () => {
  let service: VcustomizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VcustomizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
