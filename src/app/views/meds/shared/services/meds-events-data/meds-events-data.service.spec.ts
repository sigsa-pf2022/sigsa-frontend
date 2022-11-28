import { TestBed } from '@angular/core/testing';

import { MedsEventDataService } from './meds-events-data.service';

describe('MedsEventDataService', () => {
  let service: MedsEventDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedsEventDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
