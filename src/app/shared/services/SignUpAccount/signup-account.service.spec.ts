import { TestBed } from '@angular/core/testing';

import { SignupAccountService } from './signup-account.service';

describe('SignupAccountService', () => {
  let service: SignupAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
