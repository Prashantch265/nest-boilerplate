/**
 * Master list of all document types used in the system.
 * Serves as the Single Source of Truth for Programs, Applications, and Scholarships.
 */
export enum DOCUMENT_TYPE {
  // Identity
  PASSPORT = 'PASSPORT',
  CITIZENSHIP = 'CITIZENSHIP',

  // Academic
  TRANSCRIPT = 'TRANSCRIPT',
  CERTIFICATES = 'CERTIFICATES', // e.g., Graduation Certificate
  AWARDS = 'AWARDS',

  // Application Specific
  SOP = 'SOP', // Statement of Purpose
  LOR = 'LOR', // Letter of Recommendation
  PERSONAL_STATEMENT = 'PERSONAL_STATEMENT',
  STUDY_PLAN = 'STUDY_PLAN',

  // Financial
  FINANCIAL_PROOF = 'FINANCIAL_PROOF', // Bank Statement, Sponsorship Letter
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT', // Application Fee Payment

  // Test Reports (Inferred from scores, but can be requested explicitly)
  IELTS_REPORT = 'IELTS_REPORT',
  TOEFL_REPORT = 'TOEFL_REPORT',
  TOPIK_REPORT = 'TOPIK_REPORT',

  // Others
  OTHER = 'OTHER',
}

/**
 * Helper mapping to present human-readable context to the user (Frontend).
 */
export const DOCUMENT_TYPE_LABELS: Record<DOCUMENT_TYPE, string> = {
  [DOCUMENT_TYPE.PASSPORT]: 'Passport Copy',
  [DOCUMENT_TYPE.CITIZENSHIP]: 'Citizenship Document',
  [DOCUMENT_TYPE.TRANSCRIPT]: 'Academic Transcript',
  [DOCUMENT_TYPE.CERTIFICATES]: 'Academic Certificates',
  [DOCUMENT_TYPE.AWARDS]: 'Awards & Honors',
  [DOCUMENT_TYPE.SOP]: 'Statement of Purpose (SOP)',
  [DOCUMENT_TYPE.LOR]: 'Letter of Recommendation (LOR)',
  [DOCUMENT_TYPE.PERSONAL_STATEMENT]: 'Personal Statement',
  [DOCUMENT_TYPE.STUDY_PLAN]: 'Study Plan',
  [DOCUMENT_TYPE.FINANCIAL_PROOF]: 'Financial Proof (Bank Statement)',
  [DOCUMENT_TYPE.PAYMENT_RECEIPT]: 'Application Fee Payment Receipt',
  [DOCUMENT_TYPE.IELTS_REPORT]: 'IELTS Score Report',
  [DOCUMENT_TYPE.TOEFL_REPORT]: 'TOEFL Score Report',
  [DOCUMENT_TYPE.TOPIK_REPORT]: 'TOPIK Score Report',
  [DOCUMENT_TYPE.OTHER]: 'Other Document',
};
