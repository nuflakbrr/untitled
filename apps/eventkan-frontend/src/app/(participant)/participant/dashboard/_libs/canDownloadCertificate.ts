export const canDownloadCertificate = (
  status: string,
  certificateEnabled: boolean,
  certificates: Array<{ id: string; downloadUrl: string }>
): boolean => status === 'CHECKED_IN' && certificateEnabled && certificates.length > 0;
