import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean | undefined> {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}
