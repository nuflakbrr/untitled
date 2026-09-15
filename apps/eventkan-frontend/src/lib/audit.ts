export const logAudit = async (params: {
  actorUserId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  target: string;
  targetId: string;
  details?: object;
  ip?: string;
}): Promise<void> => {
  try {
    console.log(
      JSON.stringify({ timestamp: new Date().toISOString(), type: 'AUDIT_LOG', ...params })
    );
  } catch (error) {
    console.error('Audit logging failed', error);
  }
};
