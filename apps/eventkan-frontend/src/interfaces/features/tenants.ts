export interface AdminTenant {
  id: string;
  code?: string;
  name: string;
  slug?: string;
  type?: string;
}

export interface AdminTenantRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  type: string;
  parentId?: string;
  depth?: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  parentName: string;
  createdAt: string;
}

export interface TenantPaginationResponse {
  success: boolean;
  data: AdminTenantRow[];
  meta: { total: number; page: number; lastPage: number };
}

export interface TenantPaymentGateway {
  provider: 'IPAYMU';
  is_active: boolean;
  api_key?: string;
  virtual_account?: string;
  env: 'sandbox' | 'production';
  has_api_key?: boolean;
}
