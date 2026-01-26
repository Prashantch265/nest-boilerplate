import { USER_TYPE } from '../../common/enums/users.enum';

/**
 * Interface for the data we want to encode in the JWT.
 */
export interface TokenPayload {
  sub: string; // User ID
  userType: USER_TYPE;
}

/**
 * Interface for the decoded payload from a verified token.
 */
export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}
