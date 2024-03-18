import { TestBed } from '@angular/core/testing';

import { FilterForuserService } from './filter-foruser.service';

describe('FilterForuserService', () => {
  let service: FilterForuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterForuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
