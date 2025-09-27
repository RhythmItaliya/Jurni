'use client';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useLogout } from '@/hooks/useAuth';

export default function LeftSidebar() {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="left-sidebar">
      <div className="sidebar-top">
        <div className="logo">Jurni</div>
        <ThemeToggle />
      </div>

      <div className="sidebar-nav">
        <div className="nav-item">
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-text">Profile</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📈</span>
          <span className="nav-text">Trading</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📤</span>
          <span className="nav-text">Upload</span>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="nav-item profile-item">
          <span className="nav-icon">👤</span>
          <span className="nav-text">Profile</span>
        </div>
        <div className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-text">
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </span>
        </div>
      </div>
    </div>
  );
}
