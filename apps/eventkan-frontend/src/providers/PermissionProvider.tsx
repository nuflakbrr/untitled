'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useContext, createContext } from 'react';
import { getCurrentUserData } from '@/services/admin/users';

type PermissionContextType = {
  permissions: string[];
  roles: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isLoading: boolean;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{
  children: React.ReactNode;
  initialPermissions?: string[];
  initialRoles?: string[];
}> = ({ children, initialPermissions = [], initialRoles = [] }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: () => getCurrentUserData(),
    initialData: { permissions: initialPermissions, roles: initialRoles },
  });

  const permissions = data?.permissions || [];
  const roles = data?.roles || [];

  const hasPermission = (permission: string) => permissions.includes(permission);

  const hasRole = (role: string) => roles.some((r: string) => r.toLowerCase() === role.toLowerCase());

  return (
    <PermissionContext.Provider value={{ permissions, roles, hasPermission, hasRole, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
