export interface MedicalDocument {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileContent: string; // Base64
  documentDate: Date | string;
  date: Date | string;
  status: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface CreateDocumentDTO {
  title: string;
  description?: string;
  fileContent: string; // Base64
  fileName: string;
  mimeType: string;
  fileSize: number;
  documentDate: string;
  date: string;
}

export interface EditDocumentDTO {
  title?: string;
  description?: string;
  documentDate?: string;
  date?: string;
  status?: string;
  // Reemplazo de archivo (opcional, al editar la imagen del documento)
  fileContent?: string; // Base64
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
}

export interface DocumentWithContent extends MedicalDocument {
  fileContent: string; // Base64
}
