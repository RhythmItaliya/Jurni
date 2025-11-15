import React from 'react';
import { motion } from 'framer-motion';
import { Grid } from 'lucide-react';

export default function ProfileEmpty({ type }: { type: string }) {
  let message = '';
  if (type === 'videos') message = 'Upload your first video';
  if (type === 'favourites') message = 'No favourites yet';
  if (type === 'liked') message = 'No liked videos yet';

  return (
    <motion.div
      className="emptyContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="iconWrapper">
        <Grid size={48} />
      </div>
      <div className="emptyText">{message}</div>
      <div className="subText">
        {type === 'videos' ? 'Your videos will appear here' : null}
      </div>
    </motion.div>
  );
}
