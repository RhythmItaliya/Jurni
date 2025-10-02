'use client';

import React from 'react';
import { Card } from '../Card';
import { CardBody } from '../Card';
import { CardHeader } from '../Card';
import { CardFooter } from '../Card';

export default function SkeletonPost() {
  return (
    <Card className="post-card skeleton">
      <CardHeader>
        <div className="post-header">
          <div className="post-avatar skeleton-box" />
          <div className="post-meta">
            <div className="skeleton-line w-32" />
            <div className="skeleton-line w-20" />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="skeleton-line w-full" />
        <div className="skeleton-line w-5/6" />
        <div className="post-media-grid">
          <div className="post-media-item skeleton-box" />
        </div>
      </CardBody>
      <CardFooter>
        <div className="post-actions">
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
        </div>
      </CardFooter>
    </Card>
  );
}
