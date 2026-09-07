'use client';

import type { Testimonial } from '@/interfaces/features/testimonials';

import { toast } from 'sonner';
import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { Copy, Trash, MoreHorizontal } from 'lucide-react';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { deleteTestimonial } from '@/services/public/testimonials';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CellActionProps {
  data: Testimonial;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTestimonial(data.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['testimonies'] });
        setOpenDelete(false);
      } else {
        toast.error(res.message);
      }
    },
    onError: () => {
      toast.error('Terjadi kesalahan saat menghapus testimoni.');
    },
  });

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
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

          {hasPermission('testimonies.delete') && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setOpenDelete(true)}
              className="cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus Testimoni
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
