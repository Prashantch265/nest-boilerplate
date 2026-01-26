/**
 * Password Hashing Utility
 *
 * This module provides utility functions for securely hashing and comparing
 * passwords using the 'bcryptjs' library.
 */

import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 10; // The cost factor for hashing. 10 is a good default.

/**
 * Hashes a plain-text password.
 * @param {string} plainTextPassword - The password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const hashPassword = async (
  plainTextPassword: string,
): Promise<string> => {
  const hashedPassword = await hash(plainTextPassword, SALT_ROUNDS);
  return hashedPassword;
};

/**
 * Compares a plain-text password with a stored hash.
 * @param {string} plainTextPassword - The password provided by the user during login.
 * @param {string} storedHash - The hashed password retrieved from the database.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async (
  plainTextPassword: string,
  storedHash: string,
): Promise<boolean> => {
  const isMatch = await compare(plainTextPassword, storedHash);
  return isMatch;
};
