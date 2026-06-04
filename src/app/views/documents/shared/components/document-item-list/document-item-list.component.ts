import { Component, Input, OnInit } from '@angular/core';
import { MedicalDocument } from '../../interfaces/Document.interface';

@Component({
  selector: 'app-document-item-list',
  template: `
    <ion-item
      class="list-item"
      lines="none"
      [button]="true"
      detail="false"
    >
      <div class="list-item__icon list-item__icon--document" aria-hidden="true">
        <ion-icon [name]="getIconByMimeType(document.mimeType)"></ion-icon>
      </div>
      <div class="list-item__body">
        <span class="list-item__title">{{ document.title }}</span>
        <span class="list-item__meta">
          <span>{{ document.documentDate | date: 'dd/MM/yyyy' }}</span>
          <span class="list-item__dot">·</span>
          <span>{{ formatFileSize(document.fileSize) }}</span>
        </span>
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
