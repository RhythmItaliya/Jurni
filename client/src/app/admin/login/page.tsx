'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminLogin } from '@/hooks';
import Link from 'next/link';

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
    <div className="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="admin-login-card"
      >
        <div className="admin-login-header">
          <h1>Jurni Admin</h1>
          <p>Sign in to continue to Admin Panel</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Email or Username</label>
            <input
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
            <input
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

          <button
            type="submit"
            className="admin-login-button"
            disabled={adminLogin.isPending}
          >
            {adminLogin.isPending ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="admin-login-footer">
            <Link href="/" className="back-link">
              ← Back to Main Site
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
