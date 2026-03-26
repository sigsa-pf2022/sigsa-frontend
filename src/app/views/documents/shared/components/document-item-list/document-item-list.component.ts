import { Component, Input, OnInit } from '@angular/core';
import { MedicalDocument } from '../../interfaces/Document.interface';

@Component({
  selector: 'app-document-item-list',
  template: `
    <ion-item [class.dil--flush]="flush" class="dil">
      <div class="dil__img">
        <ion-icon [name]="getIconByMimeType(document.mimeType)"></ion-icon>
      </div>
      <div class="dil__content">
        <div class="dil__content__title">
          <ion-text>{{ document.title }}</ion-text>
        </div>
        <div class="dil__content__subtitle">
          {{ document.documentDate | date: 'dd/MM/yyyy' }} • {{ formatFileSize(document.fileSize) }}
        </div>
      </div>
    </ion-item>
  `,
  styleUrls: ['./document-item-list.component.scss'],
})
export class DocumentItemListComponent implements OnInit {
  @Input() document: MedicalDocument;
  @Input() flush: boolean = false;

  constructor() {}

  ngOnInit() {}

  getIconByMimeType(mimeType: string): string {
    if (mimeType.includes('pdf')) {
      return 'document-text';
    } else if (mimeType.includes('image')) {
      return 'image';
    } else {
      return 'document';
    }
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }
}
