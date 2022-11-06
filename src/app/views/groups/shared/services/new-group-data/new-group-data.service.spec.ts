import { TestBed } from '@angular/core/testing';

import { NewGroupDataService } from './new-group-data.service';

describe('NewGroupDataService', () => {
  let service: NewGroupDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewGroupDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
