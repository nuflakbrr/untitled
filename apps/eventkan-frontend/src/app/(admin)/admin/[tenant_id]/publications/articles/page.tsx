'use client';

import Link from 'next/link';
import { Tag, Plus } from 'lucide-react';
import { type FC, useState } from 'react';

import type { Article } from '@/interfaces/features/articles';

import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useTenantId } from '@/hooks/useTenantId';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';

import Columns from './_components/Columns';
import CategoryModal from './_components/CategoryModal';
import { useArticlesList } from './_hooks/useArticlesList';
import { useArticlesBulkActions } from './_hooks/useArticlesBulkActions';

const ArticlesCMS: FC = () => {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { articles, meta, isLoading, setPage, setLimit, search, handleSearchChange } =
    useArticlesList(includeDeleted);
  const { bulkDelete, isPending: isBulkDeletePending } = useArticlesBulkActions(() => {
    setIsBulkDeleteOpen(false);
    setSelectedArticles([]);
    setRowSelection({});
  });

  return (
    <section className="mx-auto w-full max-w-375">
      <AlertModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={() => bulkDelete(selectedArticles.map((article) => article.id))}
        loading={isBulkDeletePending}
      />

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />

      <Heading
        variant="soft"
        title="Artikel"
        titleSuffix={`(${meta.total})`}
        description="Kelola publikasi artikel dan kategori artikel."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {hasPermission('article.category.read') && (
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(true)}
              className="w-full rounded-xl border-eventkan-ink/10 text-eventkan-navy hover:bg-eventkan-canvas sm:w-auto"
            >
              <Tag /> Master Kategori
            </Button>
          )}
          {hasPermission('article.create') && (
              <Button asChild className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto">
              <Link href={`/admin/${tenantId}/publications/articles/new`}>
                <Plus /> Tambah Artikel
              </Link>
            </Button>
          )}
          </div>
        }
      />

      <div>
        <DataTable
          searchKey="title"
          columns={Columns}
          data={articles}
          isFetching={isLoading}
          pageCount={meta.lastPage}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => setLimit(l)}
          onSearchChange={handleSearchChange}
          onBulkDelete={
            hasPermission('article.delete')
              ? (rows) => {
                  setSelectedArticles(rows);
                  setIsBulkDeleteOpen(true);
                }
              : undefined
          }
          includeDeleted={includeDeleted}
          onIncludeDeletedChange={(value) => {
            setIncludeDeleted(value);
            setPage(1);
          }}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          searchValue={search}
          variant="eventkan"
        />
      </div>
    </section>
  );
};

export default ArticlesCMS;
