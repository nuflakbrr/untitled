import { AccessResourcePage } from '../access-resource-page';

export default function PermissionsPage() {
  return (
    <AccessResourcePage
      title="Manajemen hak akses"
      description="Atur tindakan yang boleh dilakukan pengguna di dalam aplikasi."
      permission="permission.read"
      resource="permissions"
    />
  );
}
