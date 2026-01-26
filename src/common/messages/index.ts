export const Messages = {
  // General
  SUCCESS: 'Operation completed successfully.',
  FAILURE: 'Operation failed.',
  VALIDATION_ERROR: 'One or more fields are invalid.',
  UNAUTHORIZED: 'Unauthorized access.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: (resource: string) => `${resource} not found.`,
  ALREADY_EXISTS: (resource: string) => `${resource} already exists.`,
  INTERNAL_SERVER_ERROR:
    'An unexpected error occurred. Please try again later.',
  BAD_REQUEST: 'Invalid request parameters.',

  // Authentication & Authorization
  LOGIN_SUCCESS: 'Login successful.',
  LOGIN_FAILED: 'Invalid email or password.',
  LOGOUT_SUCCESS: 'Logout successful.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  TOKEN_INVALID: 'Invalid authentication token.',

  // User
  USER_REGISTERED: 'User registered successfully.',
  USER_ALREADY_EXISTS: 'User with given details already exists.',
  USER_NOT_FOUND: 'User not found.',
  PASSWORD_INCORRECT: 'Incorrect password.',
  PASSWORD_UPDATED: 'Password updated successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',

  // CRUD (generic)
  FETCH_SUCCESS: (entity: string) => `${entity} fetched successfully.`,
  CREATE_SUCCESS: (entity: string) => `${entity} created successfully.`,
  UPDATE_SUCCESS: (entity: string) => `${entity} updated successfully.`,
  DELETE_SUCCESS: (entity: string) => `${entity} deleted successfully.`,
  NOT_FOUND_ENTITY: (entity: string) => `${entity} not found.`,

  // File Upload
  FILE_UPLOADED: 'File uploaded successfully.',
  FILE_TOO_LARGE: 'Uploaded file exceeds size limit.',
  FILE_INVALID_TYPE: 'Unsupported file type.',

  // System
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
};
