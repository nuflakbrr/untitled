import type { FC } from 'react';

import Link from 'next/link';

import type { EmptyStateProps } from '@/interfaces/layout';

const EmptyState: FC<EmptyStateProps> = ({ action, description, icon: Icon, title }) => (
  <div className="flex flex-col items-center rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] px-6 py-16 text-center">
    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ffe5d8] text-[#ff7a45]">
      <Icon className="h-6 w-6" />
    </div>
    <h2 className="font-display mt-5 text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">
      {title}
    </h2>
    <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6c7280]">{description}</p>
    {action && (
      <Link
        href={action.href}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#11233f] px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
      >
        {action.label}
        {action.icon && <action.icon className="h-4 w-4" />}
      </Link>
    )}
  </div>
);

export default EmptyState;
