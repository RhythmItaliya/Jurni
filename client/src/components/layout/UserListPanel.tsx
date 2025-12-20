'use client';

import { User } from 'lucide-react';
import UserListItem from '@/components/ui/UserListItem';
import UserListSkeleton from '@/components/ui/UserListSkeleton';

interface UserListPanelProps {
  users?: any[];
  isLoading: boolean;
  emptyMessage: string;
}

export default function UserListPanel({
  users,
  isLoading,
  emptyMessage,
}: UserListPanelProps) {
  if (isLoading) {
    return <UserListSkeleton />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="user-list__empty">
        <User size={48} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map((user: any, index: number) => (
        <UserListItem key={user.uuid || index} user={user} index={index} />
      ))}
    </div>
  );
}
