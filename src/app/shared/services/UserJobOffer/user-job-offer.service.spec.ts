import { TestBed } from '@angular/core/testing';

import { UserJobOfferService } from './user-job-offer.service';

describe('UserJobOfferService', () => {
  let service: UserJobOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserJobOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
