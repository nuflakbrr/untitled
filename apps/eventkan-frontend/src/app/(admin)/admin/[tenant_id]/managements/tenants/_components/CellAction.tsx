'use client';

import type { AdminTenantRow } from '@/services/admin/tenants';

import { toast } from 'sonner';
import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { deleteTenant } from '@/services/admin/tenants';
import { useRouter, usePathname } from 'next/navigation';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { Copy, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CellActionProps {
  data: AdminTenantRow;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const tenantId = usePathname().split('/')[2];
  const queryClient = useQueryClient();
  const { hasPermission, hasRole } = usePermission();
  const [openDelete, setOpenDelete] = useState(false);
  const isRootSuperadmin = hasRole('root_superadmin');
  const canManageTenant = isRootSuperadmin || data.parentId === tenantId;
  const canDeleteTenant = !['root', 'university'].some((type) =>
    data.type.toLowerCase().includes(type)
  );
  const { mutate: onDelete, isPending } = useMutation({
    mutationFn: () => deleteTenant(data.id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tenant berhasil dihapus.');
        queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
        setOpenDelete(false);
      } else toast.error(result.error);
    },
    onError: () => toast.error('Gagal menghapus tenant.'),
  });

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              copyToClipboard(data.id);
              toast.success('ID disalin ke clipboard.');
            }}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {hasPermission('tenant.update') && canManageTenant && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() => router.push(`/admin/${tenantId}/managements/tenants/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}
          {hasPermission('tenant.delete') && canManageTenant && canDeleteTenant && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
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
