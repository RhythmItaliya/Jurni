'use client';

import Button from '@/components/ui/Button';

/**
 * Main content area component with header layout
 * @returns {JSX.Element} Main content with header structure
 */
export default function MainContent() {
  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="main-header">
        <h1>Jurni - Forest Adventure</h1>
        <p>Explore the beauty of nature with our travel platform</p>
      </div>

      {/* Main Content Area */}
      <div className="main-body">
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* Forest Theme Buttons */}
          <section>
            <h2>Forest Theme Buttons</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="forest">Forest</Button>
              <Button variant="nature">Nature</Button>
              <Button variant="travel">Travel</Button>
              <Button variant="explore">Explore</Button>
            </div>
          </section>

          {/* Status Buttons */}
          <section>
            <h2>Status & Alert Buttons</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
              <Button variant="info">Info</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="neutral">Neutral</Button>
            </div>
          </section>

          {/* Theme Buttons */}
          <section>
            <h2>Theme Buttons</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="light">Light</Button>
              <Button variant="dark">Dark</Button>
            </div>
          </section>

          {/* Icon + Text Buttons */}
          <section>
            <h2>Icon + Text Buttons</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="primary" icon="🏠" iconPosition="left">
                Home
              </Button>
              <Button variant="forest" icon="🌲" iconPosition="left">
                Forest
              </Button>
              <Button variant="travel" icon="✈️" iconPosition="left">
                Travel
              </Button>
              <Button variant="nature" icon="🌿" iconPosition="left">
                Nature
              </Button>
              <Button variant="success" icon="✅" iconPosition="left">
                Success
              </Button>
              <Button variant="warning" icon="⚠️" iconPosition="left">
                Warning
              </Button>
              <Button variant="error" icon="❌" iconPosition="left">
                Error
              </Button>
              <Button variant="info" icon="ℹ️" iconPosition="left">
                Info
              </Button>
            </div>
          </section>

          {/* Icon Position Examples */}
          <section>
            <h2>Icon Position Examples</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="primary" icon="⬅️" iconPosition="left">
                Back
              </Button>
              <Button variant="primary" icon="➡️" iconPosition="right">
                Next
              </Button>
              <Button variant="forest" icon="📁" iconPosition="left">
                Open
              </Button>
              <Button variant="forest" icon="💾" iconPosition="right">
                Save
              </Button>
              <Button variant="travel" icon="🗺️" iconPosition="left">
                Map
              </Button>
              <Button variant="travel" icon="📷" iconPosition="right">
                Photo
              </Button>
            </div>
          </section>

          {/* Button Sizes Section */}
          <section>
            <h2>Button Sizes</h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
              <Button variant="primary" size="xl">
                Extra Large
              </Button>
            </div>
          </section>

          {/* Button Effects Section */}
          <section>
            <h2>Button Effects</h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <Button variant="primary" effect="shine">
                Shine Effect
              </Button>
              <Button variant="forest" effect="glow">
                Glow Effect
              </Button>
              <Button variant="nature" effect="pulse">
                Pulse Effect
              </Button>
              <Button variant="travel" effect="shine">
                Travel Shine
              </Button>
            </div>
          </section>

          {/* Practical Examples */}
          <section>
            <h2>Practical Examples</h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Action Buttons */}
              <div>
                <h3>Action Buttons</h3>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <Button
                    variant="forest"
                    size="lg"
                    effect="glow"
                    onClick={() => alert('Welcome to the forest!')}
                  >
                    Start Forest Journey
                  </Button>
                  <Button
                    variant="travel"
                    size="md"
                    effect="shine"
                    onClick={() => alert('Adventure awaits!')}
                  >
                    Plan Adventure
                  </Button>
                  <Button
                    variant="nature"
                    size="md"
                    effect="pulse"
                    onClick={() => alert('Connect with nature!')}
                  >
                    Connect with Nature
                  </Button>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h3>Status Actions</h3>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <Button
                    variant="success"
                    onClick={() => alert('Action completed successfully!')}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => alert('Please review your input!')}
                  >
                    Review Required
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => alert('Something went wrong!')}
                  >
                    Report Error
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => alert('Here is some information!')}
                  >
                    Show Info
                  </Button>
                </div>
              </div>

              {/* Destructive Actions */}
              <div>
                <h3>Destructive Actions</h3>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <Button
                    variant="danger"
                    onClick={() => alert('This action cannot be undone!')}
                  >
                    Delete Account
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => alert('Are you sure?')}
                  >
                    Remove Item
                  </Button>
                  <Button
                    variant="neutral"
                    onClick={() => alert('Action cancelled!')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Utility Actions */}
              <div>
                <h3>Utility Actions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Learn more!')}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Secondary action!')}
                  >
                    Secondary Action
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => alert('Light action!')}
                  >
                    Light Action
                  </Button>
                  <Button variant="dark" onClick={() => alert('Dark action!')}>
                    Dark Action
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Disabled States */}
          <section>
            <h2>Disabled States</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Button variant="primary" disabled>
                Disabled Primary
              </Button>
              <Button variant="forest" disabled>
                Disabled Forest
              </Button>
              <Button variant="travel" disabled>
                Disabled Travel
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
