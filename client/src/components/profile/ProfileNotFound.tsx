import React from 'react';
import Link from 'next/link';

interface ProfileNotFoundProps {
  username: string;
}

/**
 * ProfileNotFound component - displays a styled error page when a user profile is not found
 * @param {string} username - The username that was not found
 */
export const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({
  username,
}) => {
  return (
    <div className="profile-not-found">
      <div className="profile-not-found__container">
        <div className="profile-not-found__content">
          {/* Icon */}
          <div className="profile-not-found__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="profile-not-found__title">User Not Found</h1>

          {/* Username */}
          <p className="profile-not-found__username">@{username}</p>

          {/* Description */}
          <p className="profile-not-found__description">
            Sorry, we couldn&apos;t find the user you&apos;re looking for. This
            profile may have been removed or the username might be incorrect.
          </p>

          {/* Actions */}
          <div className="profile-not-found__actions">
            <Link href="/" className="profile-not-found__button primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="profile-not-found__decoration">
          <div className="decoration-circle decoration-circle--1"></div>
          <div className="decoration-circle decoration-circle--2"></div>
          <div className="decoration-circle decoration-circle--3"></div>
        </div>
      </div>
    </div>
  );
};
