import React from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

export default function ProfileHeader({
  username,
  bio,
  onEdit,
}: {
  username: string;
  bio?: string;
  onEdit: () => void;
}) {
  return (
    <motion.div
      className="profileHeader"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="avatarWrapper">
        <div className="avatar" />
      </div>
      <div className="profileInfo">
        <div className="usernameRow">
          <span className="username">{username}</span>
          <button className="editBtn" onClick={onEdit}>
            <Pencil size={18} /> Edit profile
          </button>
        </div>
        <div className="statsRow">
          <span>0 Following</span>
          <span>0 Followers</span>
          <span>0 Likes</span>
        </div>
        <div className="bio">{bio || 'No bio yet.'}</div>
      </div>
    </motion.div>
  );
}
