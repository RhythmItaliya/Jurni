'use client';

/**
 * Admin settings page
 * @returns {JSX.Element} The settings page
 */
export default function AdminSettings() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <p>Configure platform settings and preferences</p>
      </div>

      <div className="admin-section">
        <h2>General Settings</h2>
        <div className="admin-settings-grid">
          <div className="setting-item">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              className="admin-input"
              defaultValue="Jurni"
            />
          </div>
          <div className="setting-item">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              className="admin-textarea"
              rows={3}
              defaultValue="A social platform for sharing stories"
            />
          </div>
          <div className="setting-item">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              className="admin-input"
              defaultValue="admin@jurni.com"
            />
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>User Settings</h2>
        <div className="admin-settings-grid">
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="allowRegistration"
              className="admin-checkbox"
              defaultChecked
            />
            <label htmlFor="allowRegistration">
              Allow new user registration
            </label>
          </div>
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="emailVerification"
              className="admin-checkbox"
              defaultChecked
            />
            <label htmlFor="emailVerification">
              Require email verification
            </label>
          </div>
          <div className="setting-item">
            <label htmlFor="minAge">Minimum age requirement</label>
            <input
              type="number"
              id="minAge"
              className="admin-input"
              defaultValue="13"
              min="1"
              max="100"
            />
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Content Settings</h2>
        <div className="admin-settings-grid">
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="moderateComments"
              className="admin-checkbox"
            />
            <label htmlFor="moderateComments">
              Moderate comments before publishing
            </label>
          </div>
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="moderatePosts"
              className="admin-checkbox"
            />
            <label htmlFor="moderatePosts">
              Moderate posts before publishing
            </label>
          </div>
          <div className="setting-item">
            <label htmlFor="maxFileSize">Maximum upload file size (MB)</label>
            <input
              type="number"
              id="maxFileSize"
              className="admin-input"
              defaultValue="10"
              min="1"
              max="100"
            />
          </div>
          <div className="setting-item">
            <label htmlFor="allowedFileTypes">Allowed file types</label>
            <input
              type="text"
              id="allowedFileTypes"
              className="admin-input"
              defaultValue="jpg, png, gif, mp4, mp3"
            />
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Security Settings</h2>
        <div className="admin-settings-grid">
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="twoFactorAuth"
              className="admin-checkbox"
              defaultChecked
            />
            <label htmlFor="twoFactorAuth">
              Enable two-factor authentication
            </label>
          </div>
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="captcha"
              className="admin-checkbox"
              defaultChecked
            />
            <label htmlFor="captcha">Enable CAPTCHA on registration</label>
          </div>
          <div className="setting-item">
            <label htmlFor="sessionTimeout">Session timeout (minutes)</label>
            <input
              type="number"
              id="sessionTimeout"
              className="admin-input"
              defaultValue="30"
              min="5"
              max="1440"
            />
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Notification Settings</h2>
        <div className="admin-settings-grid">
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="emailNotifications"
              className="admin-checkbox"
              defaultChecked
            />
            <label htmlFor="emailNotifications">
              Enable email notifications
            </label>
          </div>
          <div className="setting-item checkbox-item">
            <input
              type="checkbox"
              id="pushNotifications"
              className="admin-checkbox"
              defaultChecked
            />
            <label htmlFor="pushNotifications">Enable push notifications</label>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary">Save Settings</button>
          <button className="admin-btn admin-btn-secondary">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
