import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendVerificationEmailModalComponent } from './send-verification-email-modal.component';

describe('SendVerificationEmailModalComponent', () => {
  let component: SendVerificationEmailModalComponent;
  let fixture: ComponentFixture<SendVerificationEmailModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendVerificationEmailModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendVerificationEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
