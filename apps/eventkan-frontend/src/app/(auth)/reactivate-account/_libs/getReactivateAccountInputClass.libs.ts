export const getReactivateAccountInputClass = (hasError: boolean): string =>
  `w-full rounded-[14px] border bg-eventkan-surface px-4 py-3 text-sm text-eventkan-navy outline-none transition placeholder:text-eventkan-muted/70 focus:border-eventkan-navy focus:ring-3 focus:ring-eventkan-navy/15 disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError ? 'border-eventkan-peach-ink' : 'border-eventkan-ink/15'
  }`;
