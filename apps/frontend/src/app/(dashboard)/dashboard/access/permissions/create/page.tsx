import { AdminResourceForm } from '../../admin-resource-form';

export default function CreatePermissionPage() {
  return <AdminResourceForm resource="roles/permissions" routeResource="permissions" />;
}
