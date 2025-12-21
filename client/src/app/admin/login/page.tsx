'use client';

import { useState } from 'react';
import { useAdminLogin } from '@/hooks';
import { Input, Button, Card, CardBody, Link } from '@/components/ui';
import { Logo } from '@/components/ui/Logo';
import { AuthThemeToggle } from '@/components/ui/AuthThemeToggle';

export default function AdminLogin() {
  const adminLogin = useAdminLogin();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.usernameOrEmail || !formData.password) {
      return;
    }

    adminLogin.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="auth-layout">
      <div className="auth-promo">
        <img
          src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1766298274/Jurni/Admin_Jurni.png"
          alt="Admin Login"
          className="auth-promo-image"
        />
      </div>

      <div className="auth-form-section">
        <Card variant="elevated" className="card-flat auth-card-width">
          <CardBody>
            <div className="auth-container">
              <div className="auth-header">
                <Logo variant="auto" size="md" />
                <h1 className="auth-title">Admin Panel</h1>
                <p className="auth-subtitle">
                  Sign in to continue to Admin Panel
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="usernameOrEmail">Email or Username</label>
                  <Input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    className="form-input"
                    placeholder="Enter your email or username"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    disabled={adminLogin.isPending}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={adminLogin.isPending}
                    required
                  />
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={adminLogin.isPending}
                    loadingText="Signing in..."
                    className="auth-button"
                  >
                    Sign In
                  </Button>
                </div>

                <div className="auth-links-container">
                  <Link
                    href="/"
                    variant="forest"
                    size="sm"
                    className="auth-link"
                  >
                    Back to Main Site
                  </Link>

                  <AuthThemeToggle />
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
