import { TestBed } from '@angular/core/testing';

import { RegisterFormDataService } from './register-form-data.service';

describe('RegisterFormDataService', () => {
  let service: RegisterFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
