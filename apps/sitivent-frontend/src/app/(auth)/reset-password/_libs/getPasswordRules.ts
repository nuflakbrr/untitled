export const getPasswordRules = (password: string) => [
  { label: 'Minimal 8 karakter', valid: password.length >= 8 },
  { label: 'Memiliki huruf besar', valid: /[A-Z]/.test(password) },
  { label: 'Memiliki angka', valid: /[0-9]/.test(password) },
];
