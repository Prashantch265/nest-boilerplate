/**
 * OTP Utility
 *
 * This module provides a function to generate a random, 6-digit numeric OTP.
 */

/**
 * Generates a random 6-digit OTP string.
 * @returns {string} A 6-digit string.
 */
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
