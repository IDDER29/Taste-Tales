import bcrypt from "bcryptjs";

// Cost factor 12 is a sensible default for interactive logins.
export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, 12);

export const verifyPassword = (
  plain: string,
  hash: string
): Promise<boolean> => bcrypt.compare(plain, hash);
