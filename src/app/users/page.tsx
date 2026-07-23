'use client';

import React from 'react';
import UserManagementView from '../../components/UserManagementView';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();

  return (
    <UserManagementView
      users={[]} 
      currentUser={{ name: 'User', role: 'Admin' } as any}
      onUpdateUserRole={(userId: string, newRole: string) => console.log('Update role', userId, newRole)}
      onDeleteUser={(userId: string) => console.log('Delete user', userId)}
      {...({} as any)}
    />
  );
}