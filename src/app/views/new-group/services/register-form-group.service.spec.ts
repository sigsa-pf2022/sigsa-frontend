import { TestBed } from '@angular/core/testing';

import { RegisterFormGroupService } from './register-form-group.service';

describe('RegisterFormGroupService', () => {
  let service: RegisterFormGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterFormGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
