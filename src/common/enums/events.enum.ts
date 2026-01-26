export enum EVENTS {
  /**
   * Triggered when a student successfully submits a university application.
   * Payload: UniversityApplication entity
   */
  APPLICATION_SUBMITTED = 'application.submitted',

  /**
   * Triggered when an admin or system changes the status of an application
   * (e.g., to UNDER_REVIEW, ACCEPTED, or REJECTED).
   * Payload: UniversityApplication entity
   */
  APPLICATION_STATUS_CHANGED = 'application.status_changed',
}
