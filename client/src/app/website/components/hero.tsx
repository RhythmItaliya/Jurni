'use client';

import { motion, type Variants } from 'framer-motion';
import {
  heroContentVariants,
  heroItemVariants,
  heroImageVariants,
} from '@/lib/motion';
import '@/styles/website/hero-section.scss';

export default function Hero() {
  return (
    <section className="hero-section">
      <motion.div
        className="hero-background"
        initial="hidden"
        animate="visible"
        variants={heroImageVariants}
      >
        <img
          src="https://adventor.wpengine.com/wp-content/uploads/2021/07/slider-1.jpg"
          alt="Adventure Travel"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </motion.div>
      <motion.div
        className="hero-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.1 }}
        variants={heroContentVariants}
      >
        <motion.div className="hero-icon" variants={heroItemVariants}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="58" stroke="white" strokeWidth="2" />
            <path
              d="M40 70L60 50L80 70"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.h2 className="hero-subtitle" variants={heroItemVariants}>
          Share Your Journey
        </motion.h2>
        <motion.h1 className="hero-title" variants={heroItemVariants}>
          Capture & Share Travel Moments
        </motion.h1>
        <motion.p className="hero-description" variants={heroItemVariants}>
          Upload photos and videos of places you visit. Scroll through stunning
          destinations, connect with travelers, and discover the world through
          their eyes.
        </motion.p>
        <motion.button
          className="hero-button"
          variants={heroItemVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Exploring
        </motion.button>
      </motion.div>
      <div className="hero-wave">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
