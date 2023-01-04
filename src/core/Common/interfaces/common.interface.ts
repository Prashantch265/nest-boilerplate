export enum SuccessMessage {
  CREATE = '%s created successfully.',
  FETCH = '%s fetched successfully',
  UPDATE = '%s updated successfully',
  DELETE = '%s deleted successfully',
  REMOVE = '%s removed successfully',
  REGISTER = '%s registered successfully',
  LOGGED_IN = 'logged in successfully',
  STORED = '%s stored successfully',
  PUBLISH = '%s published successfully',
  VERIFY = '%s verified successfully',
  REFRESH = '%s refreshed successfully',
  ARCHIVE = '%s archived',
  DEACTIVATE = '%s deactivated',
}

export enum ErrorMessage {
  INVALID_BODY = 'Cannot process request body.',
  USERNAME_NOT_AVAILABLE = 'Username is not available.Choose another username.',
  NOT_AUTHORIZED = 'You are not authorized to access this resource.',
  NOT_AUTHENTICATED = 'You are not authenticated to access this resource.',
  INVALID_CREDENTIAL = 'invalid Email or Password',
  NOT_FOUND = '%s not found.',
  DUPLICATE_DATA = 'Duplicate %s found.',
  TOKEN_EXPIRED = 'Access Token has expired.',
  INVALID_TOKEN = 'Invalid Token',
  INVALID_OTP = 'Invalid OTP.',
  CHILD_EXISTS = '%s is used in %s',
  PERMANENT_DATA = "You can't delete or update this %s.",
}

export enum ErrorStatusCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}
