'use client';

export default function UserListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="user-list">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="user-list__skeleton">
          <div className="user-list__skeleton-avatar" />
          <div className="user-list__skeleton-content">
            <div className="user-list__skeleton-line" />
            <div className="user-list__skeleton-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
