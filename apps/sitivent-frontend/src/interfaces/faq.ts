export type FAQCategory = 'umum' | 'peserta' | 'penyelenggara' | 'pembayaran';

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}
