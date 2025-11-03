'use client';

import React from 'react';
import { Card, CardBody } from '../Card';
import { CardHeader } from '../Card';
import { CardFooter } from '../Card';

export default function SkeletonPost() {
  return (
    <div className="post-container">
      <Card className="post-card skeleton">
        <CardHeader>
          <div className="post-header">
            <div className="author">
              <div className="author-avatar skeleton-box" />
              <div className="author-meta">
                <div className="skeleton-line w-32" />
                <div className="skeleton-line w-20" />
              </div>
            </div>
            <div className="post-header-right">
              <div className="location-icon-btn skeleton-box" />
            </div>
          </div>
        </CardHeader>
        <CardBody className="post-card-body">
          <div className="post-body">
            <div className="post-media">
              <div className="media-loading">
                <div className="skeleton-box media-skeleton" />
              </div>
            </div>
            <div className="post-content">
              <div className="post-title">
                <div className="skeleton-line w-full" />
                <div className="skeleton-line w-5/6" />
              </div>
              <div className="post-description-section">
                <div className="skeleton-line w-full" />
                <div className="skeleton-line w-4/5" />
                <div className="skeleton-line w-3/4" />
              </div>
              <div className="hashtags">
                <div className="skeleton-pill" />
                <div className="skeleton-pill" />
                <div className="skeleton-pill" />
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="post-footer">
            <div className="post-description-section">
              <div className="skeleton-line w-full" />
              <div className="skeleton-line w-5/6" />
            </div>
            <div className="post-footer-left">
              <div className="post-actions">
                <div className="action-group like-group">
                  <div className="skeleton-pill" />
                  <div className="skeleton-line w-8" />
                </div>
                <div className="action-group comment-group">
                  <div className="skeleton-pill" />
                  <div className="skeleton-line w-8" />
                </div>
                <div className="action-group share-group">
                  <div className="skeleton-pill" />
                </div>
                <div className="action-group bookmark-group">
                  <div className="skeleton-pill" />
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
