import { Eye, EyeOff } from 'lucide-react';

import type { ProfilePasswordToggleProps } from '@/interfaces/features/profile';

export default function PasswordToggle({ label, visible, onToggle }: ProfilePasswordToggleProps) {
  return (
    <button
      type="button"
      aria-label={visible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6c7280] transition-colors hover:text-[#11233f]"
      onClick={onToggle}
      tabIndex={-1}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
