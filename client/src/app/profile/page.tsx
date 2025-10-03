/**
 * Profile page component - shows user profile
 * Authentication and layout are handled by ClientLayout
 * @returns {JSX.Element} Profile page content
 */
export default function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile</h1>
        <div className="profile-content">
          <p className="page-description">
            Profile page content will go here...
          </p>
        </div>
      </div>
    </div>
  );
}
