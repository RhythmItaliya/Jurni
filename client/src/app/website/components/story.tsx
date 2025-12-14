'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { storyContainerVariants, storyItemVariants } from '@/lib/motion';

const stories = [
  {
    id: 1,
    image:
      'https://i.pinimg.com/236x/be/63/c8/be63c84f436343773b00a9cecf12d33c.jpg',
    title: 'Adventure',
  },
  {
    id: 2,
    image:
      'https://i.pinimg.com/236x/78/b2/77/78b277cb8874d98872882e5558d1bdf0.jpg',
    title: 'Beach',
  },
  {
    id: 3,
    image:
      'https://i.pinimg.com/236x/19/b2/74/19b274d1f2cf1c2fc90a111c1093eb94.jpg',
    title: 'Mountain',
  },
  {
    id: 4,
    image:
      'https://i.pinimg.com/236x/49/24/8b/49248b7db01b6a857fbb1326ccd2c598.jpg',
    title: 'City',
  },
  {
    id: 5,
    image:
      'https://i.pinimg.com/236x/70/6a/94/706a94b62285d3945f4bc2ef6ccac314.jpg',
    title: 'Forest',
  },
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
