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
      'flex w-full cursor-default items-center justify-center gap-2 rounded-[14px] bg-eventkan-canvas py-3.5 text-sm font-bold text-eventkan-muted hover:bg-eventkan-canvas disabled:opacity-100',
      className
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);

export default RegistrationStatusButton;
