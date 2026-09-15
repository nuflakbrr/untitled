'use client';

import type { Article } from '@/interfaces/features/articles';

import Link from 'next/link';
import { toast } from 'sonner';
import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Edit, Trash, RotateCcw, MoreHorizontal } from 'lucide-react';
import {
  restoreArticle,
  deleteArticleById,
  permanentlyDeleteArticle,
} from '@/services/admin/articles';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CellActionProps {
  data: Article;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const [open, setOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: (id: string) =>
      data.deletedAt ? permanentlyDeleteArticle(id) : deleteArticleById(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });
  const restoreMutation = useMutation({
    mutationFn: () => restoreArticle(data.id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['articles'] });
      } else toast.error(result.error);
    },
  });

  const onConfirm = async () => {
    mutation.mutate(data.id);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={mutation.isPending}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {!data.deletedAt && hasPermission('article.update') && (
            <DropdownMenuItem variant="warning" className="cursor-pointer" asChild>
              <Link href={`/admin/publications/articles/${data.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Ubah
              </Link>
            </DropdownMenuItem>
          )}
          {data.deletedAt && hasPermission('article.delete') && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => restoreMutation.mutate()}>
              <RotateCcw className="mr-2 h-4 w-4" /> Pulihkan
            </DropdownMenuItem>
          )}
          {hasPermission('article.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> {data.deletedAt ? 'Hapus Permanen' : 'Hapus'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
