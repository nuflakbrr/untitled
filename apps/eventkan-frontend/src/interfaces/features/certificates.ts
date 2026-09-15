import type { EventStatus, CertNumberMode } from '@/interfaces/enums';

export interface CertificateSignature {
  id: string;
  templateId: string;
  name: string;
  title: string | null;
  signatureUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateTemplateAppearance {
  backgroundUrl?: string | null;
  titleFont?: string | null;
  titleColor?: string | null;
  contentFont?: string | null;
  contentColor?: string | null;
  primaryColor?: string | null;
  showEventDate?: boolean | null;
  showEventLocation?: boolean | null;
  showHeader?: boolean | null;
  footerMarginBottom?: number | null;
}

export interface CertificateTemplateHeader {
  headerText?: string | null;
  headerSubtitle?: string | null;
  headerFont?: string | null;
  headerColor?: string | null;
}

export interface CertificateTemplateNumbering {
  numberTemplate: string;
  numberMode: CertNumberMode;
  showIssuedDate: boolean;
}

export interface CertificateTemplate
  extends CertificateTemplateAppearance, CertificateTemplateHeader, CertificateTemplateNumbering {
  id: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
  signatures: CertificateSignature[];
}

export interface EventWithCertificate {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  location: string;
  status: EventStatus;
  certificateTemplate?: {
    id: string;
    backgroundUrl: string | null;
    numberTemplate: string;
  } | null;
}
