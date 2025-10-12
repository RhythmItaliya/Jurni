/**
 * Profile page component - shows user profile
 * Authentication and layout are handled by ClientLayout
 * @returns {JSX.Element} Profile page content
 */
export default function ProfilePage() {
  // This will be rendered in MainContent via layout configuration
  // The posts will be handled by MainContent when showPosts: true
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Your posts and profile information</p>
        </div>
      </div>
    </div>
  );
}
