export function translateAuthError(message: string): string {
  if (!message) return '';
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid password') || normalized.includes('incorrect password')) {
    return 'Kata sandi saat ini tidak valid.';
  }
  if (normalized.includes('password is too short') || normalized.includes('should be at least')) {
    return 'Kata sandi baru terlalu pendek (minimal 8 karakter).';
  }
  if (normalized.includes('user not found')) return 'Pengguna tidak ditemukan.';
  if (normalized.includes('email already in use') || normalized.includes('email already exists')) {
    return 'Alamat email sudah digunakan.';
  }

  return message;
}
