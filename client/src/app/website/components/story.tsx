'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { storyContainerVariants, storyItemVariants } from '@/lib/motion';

const stories = [
  { id: 1, image: 'https://placehold.co/600x600', title: 'Adventure' },
  { id: 2, image: 'https://placehold.co/600x600', title: 'Beach' },
  { id: 3, image: 'https://placehold.co/600x600', title: 'Mountain' },
  { id: 4, image: 'https://placehold.co/600x600', title: 'City' },
  { id: 5, image: 'https://placehold.co/600x600', title: 'Forest' },
];

export default function Story() {
  return (
    <motion.div
      className="story-strip"
      variants={storyContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
    >
      {stories.map(story => (
        <motion.div
          key={story.id}
          className="story-item"
          variants={storyItemVariants}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={story.image}
            alt={story.title}
            className="story-image"
            width={600}
            height={600}
          />
          <p className="story-title">{story.title}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
