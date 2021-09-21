import { TestBed, inject } from '@angular/core/testing';

import { ForgotPasswordServiceService } from './forgot-password-service.service';

describe('ForgotPasswordServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForgotPasswordServiceService]
    });
  });

  it('should be created', inject([ForgotPasswordServiceService], (service: ForgotPasswordServiceService) => {
    expect(service).toBeTruthy();
  }));
});
