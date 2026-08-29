import { MainLayout } from 'src/layouts/main';

import { getServerSession } from 'src/auth/server';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await getServerSession();
  return (
    <MainLayout
      session={session}
      slotProps={{
        header: {
          sx: { position: { md: 'fixed' } },
        },
      }}
    >
      {children}
    </MainLayout>
  );
}
