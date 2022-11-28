import { TestBed } from '@angular/core/testing';

import { MedsEventsService } from './meds-events.service';

describe('MedsEventsService', () => {
  let service: MedsEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedsEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
