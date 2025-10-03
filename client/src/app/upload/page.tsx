/**
 * Upload page component - allows users to create and upload new posts
 * Layout: Left Sidebar (navigation) + This page content (NO right sidebar)
 * NO posts from MainContent - this is separate page content
 * @returns {JSX.Element} Upload page content
 */
export default function UploadPage() {
  return (
    <div className="upload-page">
      <div className="container">
        <h1>Create New Post</h1>
        <div className="upload-content">
          <div className="layout-demo">
            <h3>Layout Configuration for /upload:</h3>
            <ul>
              <li>✅ Left Sidebar: Navigation menu</li>
              <li>❌ Right Sidebar: No right sidebar</li>
              <li>❌ Main Content: No posts area</li>
              <li>✅ Page Content: This upload form content</li>
            </ul>
          </div>
          <p className="page-description">
            This is the upload page content. It takes the full width since
            there&apos;s no right sidebar. Only the left navigation sidebar is shown.
          </p>
        </div>
      </div>
    </div>
  );
}
