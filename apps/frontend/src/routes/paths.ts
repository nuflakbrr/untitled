// ----------------------------------------------------------------------
// Semua string route terpusat di sini — jangan hardcode URL di komponen.
//
// Kebijakan trailing slash: entri di bawah TANPA trailing slash (Next
// menormalkan saat navigasi karena `trailingSlash: true`). Untuk URL yang
// dipublikasikan ke crawler (canonical, sitemap, JSON-LD), SELALU tambahkan
// '/' di akhir — gunakan `pathWithSlash()` supaya konsisten.

export const pathWithSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

export const paths = {
  home: '/',
  event: { root: '/event', details: (slug: string) => `/event/${slug}` },
  gallery: '/gallery',
  about: '/about',
  certificates: {
    root: '/certificates',
    verify: '/certificates',
  },
  profile: '/profile',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
  },
  dashboard: {
    root: '/dashboard',
    events: '/dashboard/events',
  },
  participant: {
    dashboard: '/participant/dashboard',
    transactions: '/participant/transactions',
    certificates: '/participant/certificates',
    profile: '/participant/profile',
  },
  registration: {
    success: (id: string) => `/registration/success/${id}`,
    failed: '/registration/failed',
  },
  /**
   * Article
   */
  article: {
    root: '/article',
    details: (slug: string) => `/article/${slug}`,
  },
  /**
   * Common
   */
  maintenance: '/maintenance',
  comingSoon: '/coming-soon',
  support: '/support',
  page404: '/error/404',
  page500: '/error/500',
  /**
   * Others
   */
  blank: '/blank',
  components: '/components',
};
