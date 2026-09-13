export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  noticeTitle: string;
  notice: string;
  sections: LegalSection[];
  ctaTitle: string;
  ctaDescription: string;
}
