// ----------------------------------------------------------------------
// Centralized backend endpoint map (mirror of src/routes/paths.ts for API URLs).
//
// Paths are relative (no leading slash) so they resolve against ky's
// `baseUrl` even when it carries a path prefix.
//
// `articles` points at this monorepo's Go backend (apps/backend, content
// module — see internal/modules/features/content). `faq`/`siteContent`
// still target a `marketplace-be` contract that does not exist in this
// backend — there is no FAQ or site-content module here. Those two always
// 404 today; every consumer already falls back to static content, so
// nothing is visibly broken, but don't expect a real backend behind them
// until/unless that module gets built.

export const endpoints = {
  articles: {
    list: 'features/v1/articles',
    details: (slug: string) => `features/v1/articles/by-slug/${encodeURIComponent(slug)}`,
    categories: 'features/v1/article-categories',
  },
  faq: {
    list: 'api/faq',
  },
  siteContent: {
    map: 'api/site-content',
  },
};
