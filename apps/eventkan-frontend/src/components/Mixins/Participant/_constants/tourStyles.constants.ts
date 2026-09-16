export const participantTourStyles = {
  popover: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: '16px',
    backgroundColor: 'var(--eventkan-surface)',
    border: '1px solid rgba(17, 25, 39, .1)',
    color: 'var(--eventkan-ink)',
    padding: '20px 24px',
    minWidth: '330px',
    boxShadow: '0 20px 45px rgba(17, 35, 63, .14)',
  }),
  controls: (base: Record<string, unknown>) => ({
    ...base,
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  }),
  navigation: (base: Record<string, unknown>) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1',
  }),
  maskArea: (base: Record<string, unknown>) => ({ ...base, rx: 12 }),
  badge: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: 'var(--eventkan-accent)',
    color: '#fff',
  }),
  dot: (base: Record<string, unknown>, state?: { current?: boolean }) => ({
    ...base,
    backgroundColor: state?.current ? 'var(--eventkan-accent)' : '#d9dee6',
  }),
  close: (base: Record<string, unknown>) => ({ ...base, color: 'var(--eventkan-muted)', right: 12, top: 12 }),
};
