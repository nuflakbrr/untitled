'use client';

import { toast } from 'sonner';
import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Edit, Trash, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { AdminTenantRow } from '@/interfaces/features/tenants';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { useTenantId } from '@/hooks/useTenantId';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  cellActionItemClass,
  cellActionLabelClass,
  cellActionDangerClass,
  cellActionContentClass,
  cellActionTriggerClass,
} from '@/components/Common/CellActionMenu';

import { useCellAction } from '../_hooks/useCellAction';

const CellAction: FC<CellActionProps<AdminTenantRow>> = ({ data }) => {
  const router = useRouter();
  const tenantId = useTenantId();
  const { hasPermission, hasRole } = usePermission();
  const isRootSuperadmin = hasRole('root_superadmin');
  const canManageTenant = isRootSuperadmin || data.parentId === tenantId;
  const canDeleteTenant = !['root', 'university'].some((type) =>
    data.type.toLowerCase().includes(type)
  );
  const { openDelete, setOpenDelete, onDelete, isDeletePending } = useCellAction(data.id);

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cellActionTriggerClass}>
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cellActionContentClass}>
          <DropdownMenuLabel className={cellActionLabelClass}>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              copyToClipboard(data.id);
              toast.success('ID disalin ke clipboard.');
            }}
            className={cellActionItemClass}
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {hasPermission('tenant.update') && canManageTenant && (
            <DropdownMenuItem
              variant="accent"
              className={cellActionItemClass}
              onClick={() => router.push(`/admin/${tenantId}/managements/tenants/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}
          {hasPermission('tenant.delete') && canManageTenant && canDeleteTenant && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
