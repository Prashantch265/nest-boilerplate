import { User } from '../../../modules/users/users.entity';

/**
 * Generates a unique, sanitized directory name for a user.
 * @param user - The user entity.
 * @returns A string in the format "userId-sanitizedEmail".
 */
export const getUserStorageDirectory = (user: User): string => {
  // Sanitize the email to remove characters that are invalid in file paths.
  const sanitizedEmail = user.email.replace(/[^a-z0-9-_.@]/gi, '_');
  return `${user.userId}-${sanitizedEmail}`;
};
