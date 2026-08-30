import { AccessResourcePage } from '../access-resource-page';

export default function UsersPage() {
  return (
    <AccessResourcePage
      title="Manajemen akun"
      description="Kelola akun, peran, status, dan organisasi pengguna."
      permission="user.read"
      resource="users"
    />
  );
}
