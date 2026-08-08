export interface SubHandbook {
  id: 'default';
  welcomeMessage: string;
  importantContacts: string;
  emergencyProcedures: string;
  equipmentNotes: string;
  coverageStart?: string;
  coverageEnd?: string;
  updatedAt: number;
}

export const EMPTY_SUB_HANDBOOK: SubHandbook = {
  id: 'default',
  welcomeMessage: '',
  importantContacts: '',
  emergencyProcedures: '',
  equipmentNotes: '',
  updatedAt: 0,
};

export interface SubResource {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileType: string;
  /** Base64 data URL - keeps this JSON-exportable alongside the rest of the app's backup. */
  dataUrl: string;
  uploadedAt: number;
}
