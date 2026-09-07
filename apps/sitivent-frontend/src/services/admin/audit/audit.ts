export const logAudit = async (params: {
  actorUserId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  target: string;
  targetId: string;
  details?: object;
  ip?: string;
}): Promise<void> => {
  try {
    // Audit writes are handled by the backend API.
    // For now we log to console as a structured JSON line for log aggregators
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        type: 'AUDIT_LOG',
        ...params,
      })
    );
  } catch (err) {
    console.error('Audit logging failed', err);
  }
};
