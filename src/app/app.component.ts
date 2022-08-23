import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.setDefaultLang('es');
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
