import { TestBed } from '@angular/core/testing';

import { OffersJobService } from './offers-job.service';

describe('OffersJobService', () => {
  let service: OffersJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffersJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
