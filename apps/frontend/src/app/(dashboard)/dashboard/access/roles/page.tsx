import { AccessResourcePage } from '../access-resource-page';

export default function RolesPage() {
  return (
    <AccessResourcePage
      title="Manajemen peran pengguna"
      description="Atur peran dan hak akses yang dimiliki setiap kelompok pengguna."
      permission="role.read"
      resource="roles"
    />
  );
}
