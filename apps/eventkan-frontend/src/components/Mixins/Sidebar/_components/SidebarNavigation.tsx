'use client';

import type { Route } from 'next';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { SideLinkGroup } from '../_constants/sideLinks.constants';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

export function SidebarNavigation({
  items,
  adminPath,
  onNavigate,
}: {
  items: SideLinkGroup[];
  adminPath: string;
  onNavigate: () => void;
}) {
  return (
    <>
      {items.map((item) => (
        <SidebarGroup key={item.title}>
          {item.hasChildren ? (
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="font-medium text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={onNavigate}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`${adminPath}/${subItem.url}` as Route} onClick={onNavigate}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`${adminPath}/${item.url}` as Route} onClick={onNavigate}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarGroup>
      ))}
    </>
  );
}
