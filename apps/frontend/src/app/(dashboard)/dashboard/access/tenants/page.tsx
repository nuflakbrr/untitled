import { AccessResourcePage } from '../access-resource-page';

export default function TenantsPage() {
  return (
    <AccessResourcePage
      title="Manajemen organisasi"
      description="Kelola universitas dan fakultas dalam workspace."
      permission="tenant.read"
      resource="tenants"
    />
  );
}
