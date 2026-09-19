'use client';

import type { FC } from 'react';

import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';

import Columns from './_components/Columns';
import { usePaymentsList } from './_hooks/usePaymentsList';

const PaymentsCMS: FC = () => {
  const { setPage, search, setLimit, payments, meta, isLoading, handleSearchChange } =
    usePaymentsList();

  return (
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Transaksi Pembayaran"
        titleSuffix={`(${meta.total})`}
        description="Pantau status transaksi pembayaran pendaftaran event melalui payment gateway EVENTKAN."
      />
      <DataTable
        searchKey="registrationNumber"
        columns={Columns}
        data={payments}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari no. registrasi, event, atau peserta..."
        variant="eventkan"
      />
    </section>
  );
};

export default PaymentsCMS;
