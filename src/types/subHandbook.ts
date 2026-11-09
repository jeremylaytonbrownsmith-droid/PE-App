export interface SubHandbook {
  id: 'default';
  welcomeMessage: string;
  importantContacts: string;
  emergencyProcedures: string;
  equipmentNotes: string;
  coverageStart?: string;
  coverageEnd?: string;
  /** Which single pacing guide "Today's / This Week's Plan" should pull from. Several guides
   * can have weeks landing in the same coverage date range (a full-year guide, a term guide,
   * a leave-coverage guide), so this picks the one that's actually meant for the sub - without
   * it, every guide's matching weeks would get merged into one confusing list. */
  activeGuideId?: string;
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
