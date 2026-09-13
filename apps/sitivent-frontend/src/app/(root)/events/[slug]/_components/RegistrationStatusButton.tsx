import type { FC } from 'react';

import type { RegistrationStatusButtonProps } from '@/interfaces/features/events';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const RegistrationStatusButton: FC<RegistrationStatusButtonProps> = ({
  className,
  icon: Icon,
  label,
}) => (
  <Button
    type="button"
    disabled
    className={cn(
      'flex w-full cursor-default items-center justify-center gap-2 rounded-xl bg-[#e8e6df] py-6 text-xs font-bold uppercase tracking-wider text-[#6c7280] hover:bg-[#e8e6df] disabled:opacity-100',
      className
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);

export default RegistrationStatusButton;
