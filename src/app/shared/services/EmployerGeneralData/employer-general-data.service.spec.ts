import { TestBed } from '@angular/core/testing';

import { EmployerGeneralDataService } from './employer-general-data.service';

describe('EmployerGeneralDataService', () => {
  let service: EmployerGeneralDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployerGeneralDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
