import * as bcrypt from 'bcrypt';

/**
 * This function encrypts a password using bcrypt hashing algorithm with a salt or number of rounds.
 * @param {string} password - The password parameter is a string that represents the user's password
 * that needs to be encrypted.
 * @returns The `encryptPassword` function is returning a Promise that resolves to a string, which is
 * the hashed version of the input password.
 */
export async function encryptPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
}

/**
 * This is a TypeScript function that compares a plain text password with a hashed password using the
 * bcrypt library and returns a boolean indicating whether they match.
 * @param {string} password - The plain text password that needs to be compared with the hashed
 * password.
 * @param {string} hash - The `hash` parameter is a string that represents the hashed version of a
 * password. It is typically generated using a cryptographic hashing algorithm like bcrypt, and is used
 * to securely store and compare passwords without revealing the original password.
 * @returns a Promise that resolves to a boolean value indicating whether the provided password matches
 * the provided hash. The Promise may also resolve to undefined if there is an error during the
 * comparison process.
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean | undefined> {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}
