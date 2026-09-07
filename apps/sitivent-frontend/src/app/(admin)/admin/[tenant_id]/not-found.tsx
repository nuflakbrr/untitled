import type { FC } from 'react';

import ErrorState from '@/components/Common/ErrorState';

const AdminNotFound: FC = () => <ErrorState code={404} />;

export default AdminNotFound;
