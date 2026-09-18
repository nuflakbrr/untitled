import type { SideLinkGroup } from '../_constants/sideLinks.constants';

export function filterSidebarLinks(
  links: SideLinkGroup[],
  permissions: string[],
  isRootSuperadmin: boolean
) {
  const hasPermission = (permission?: string) =>
    !permission ||
    (permission === 'tenant.read' && isRootSuperadmin) ||
    permissions.includes(permission);

  return links.flatMap((item) => {
    if (item.hasChildren) {
      const items = item.items?.filter((subItem) => hasPermission(subItem.permission));
      return items?.length ? [{ ...item, items }] : [];
    }

    return hasPermission(item.permission) ? [item] : [];
  });
}
