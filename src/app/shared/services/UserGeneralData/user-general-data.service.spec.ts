import { TestBed } from '@angular/core/testing';

import { UserGeneralDataService } from './user-general-data.service';

describe('UserGeneralDataService', () => {
  let service: UserGeneralDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGeneralDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
