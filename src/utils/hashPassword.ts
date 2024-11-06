import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function hashPassword(password: string): Promise<string> {
  // Generate a salt
  const salt = randomBytes(8).toString('hex');

  // Hash the salt and the password together
  const hash = (await scrypt(password, salt, 32)) as Buffer;

  // Join the hashed result and the salt together
  return salt + '.' + hash.toString('hex');
}
