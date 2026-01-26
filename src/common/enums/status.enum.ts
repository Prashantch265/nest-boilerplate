// File upload related statuses
export enum FileUploadStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRYING = 'RETRYING',
}

// Document processing related statuses
export enum DocumentProcessingStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

export enum DocumentVerificationStatus {
  NOT_STARTED = 'NOT_STARTED',
  VERIFIED = 'VERIFIED',
  RESOLVED_CONFLICTS = 'RESOLVED_CONFLICTS',
}
