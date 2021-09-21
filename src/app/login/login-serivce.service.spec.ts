import { TestBed, inject } from '@angular/core/testing';

import { LoginSerivceService } from './login-serivce.service';

describe('LoginSerivceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginSerivceService]
    });
  });

  it('should be created', inject([LoginSerivceService], (service: LoginSerivceService) => {
    expect(service).toBeTruthy();
  }));
});
