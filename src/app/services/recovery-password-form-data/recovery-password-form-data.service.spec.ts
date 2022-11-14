import { TestBed } from '@angular/core/testing';

import { RecoveryPasswordFormDataService } from './recovery-password-form-data.service';

describe('RecoveryPasswordFormDataService', () => {
  let service: RecoveryPasswordFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecoveryPasswordFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
