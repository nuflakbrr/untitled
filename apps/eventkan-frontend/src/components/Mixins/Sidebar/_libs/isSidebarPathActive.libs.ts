export function isSidebarPathActive(pathname: string, adminPath: string, url: string) {
  const href = `${adminPath}/${url}`;
  return pathname === href || pathname.startsWith(`${href}/`);
}
