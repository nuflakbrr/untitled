'use client';

import { toast } from 'sonner';
import { type FC, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePermission } from '@/providers/PermissionProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Tag, Plus, Edit, Trash, Check, Loader2, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  restoreCategory,
  permanentlyDeleteCategory,
} from '@/services/admin/articles';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryModal: FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['article-categories', showDeleted],
    queryFn: async () => await getCategories(showDeleted),
    enabled: isOpen,
  });
  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreCategory(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['article-categories'] });
      } else toast.error(result.error);
    },
  });
  const permanentMutation = useMutation({
    mutationFn: (id: string) => permanentlyDeleteCategory(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['article-categories'] });
      } else toast.error(result.error);
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setNewCategory('');
        queryClient.invalidateQueries({ queryKey: ['article-categories'] });
      } else {
        toast.error(result.error);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setEditingId(null);
        setEditValue('');
        queryClient.invalidateQueries({ queryKey: ['article-categories'] });
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['article-categories'] });
      } else {
        toast.error(result.error);
      }
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    createMutation.mutate(newCategory.trim());
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return;
    updateMutation.mutate({ id, name: editValue.trim() });
  };

  const categories = categoriesData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Master Kategori Artikel</DialogTitle>
          <DialogDescription>
            Kelola daftar kategori yang dapat digunakan oleh artikel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {hasPermission('article.category.create') && (
            <form onSubmit={handleAdd} className="flex items-center gap-2">
              <Input
                placeholder="Nama kategori baru..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                disabled={createMutation.isPending}
              />
              <Button type="submit" disabled={createMutation.isPending || !newCategory.trim()}>
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Tambah
              </Button>
            </form>
          )}

          <Separator />

          <div className="flex rounded-lg bg-muted p-1">
            <Button
              type="button"
              variant={!showDeleted ? 'secondary' : 'ghost'}
              className="h-8 flex-1"
              onClick={() => setShowDeleted(false)}
            >
              Aktif
            </Button>
            <Button
              type="button"
              variant={showDeleted ? 'secondary' : 'ghost'}
              className="h-8 flex-1"
              onClick={() => setShowDeleted(true)}
            >
              Recycle Bin
            </Button>
          </div>

          <div className="max-h-87.5 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-full bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 border rounded-md group hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {editingId === cat.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 py-0 px-2"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(cat.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                    ) : (
                      <span className="text-sm font-medium truncate">{cat.name}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {editingId === cat.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-success hover:bg-success/10"
                          onClick={() => handleSaveEdit(cat.id)}
                          disabled={
                            updateMutation.isPending ||
                            deleteMutation.isPending ||
                            !editValue.trim()
                          }
                        >
                          {updateMutation.isPending && editingId === cat.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={handleCancelEdit}
                          disabled={updateMutation.isPending || deleteMutation.isPending}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {!showDeleted && hasPermission('article.category.update') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-warning hover:bg-warning/10 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => handleStartEdit(cat.id, cat.name)}
                            disabled={updateMutation.isPending || deleteMutation.isPending}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {showDeleted && hasPermission('article.category.delete') ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-emerald-600"
                              onClick={() => restoreMutation.mutate(cat.id)}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => permanentMutation.mutate(cat.id)}
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          hasPermission('article.category.delete') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                              onClick={() => deleteMutation.mutate(cat.id)}
                              disabled={updateMutation.isPending || deleteMutation.isPending}
                            >
                              {deleteMutation.isPending && deleteMutation.variables === cat.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground italic border border-dashed rounded-md">
                Belum ada kategori.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
