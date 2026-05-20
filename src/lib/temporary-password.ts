const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';

export const generateTemporaryPassword = (length = 14) => {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  return Array.from(values, value => PASSWORD_CHARS[value % PASSWORD_CHARS.length]).join('');
};
