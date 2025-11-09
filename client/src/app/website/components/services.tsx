'use client';

import { motion } from 'framer-motion';
import { servicesContainerVariants, servicesItemVariants } from '@/lib/motion';

export default function Services() {
  return (
    <section className="services-section">
      <motion.div
        className="services-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: '-100px' }}
        variants={servicesContainerVariants}
      >
        <div className="services-left">
          <motion.div
            className="services-header"
            variants={servicesItemVariants}
          >
            <p className="services-subtitle">Our Services</p>
            <h2 className="services-title">Join The Adventure With Stories</h2>
            <p className="services-description">
              Share your travel moments with the world. Connect with fellow
              adventurers, discover new destinations, and inspire others with
              your journey.
            </p>
          </motion.div>

          <div className="services-list">
            <motion.div
              className="service-item"
              variants={servicesItemVariants}
            >
              <div className="service-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="service-content">
                <h3>Custom Destinations</h3>
                <p>
                  Discover and share unique destinations that match your travel
                  style and interests.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="service-item"
              variants={servicesItemVariants}
            >
              <div className="service-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8.5"
                    cy="8.5"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 15L16 10L5 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="service-content">
                <h3>Unforgettable Moments</h3>
                <p>
                  Capture and share your most memorable travel experiences with
                  stunning photos and videos.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.button
            className="services-button"
            variants={servicesItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See All Services
          </motion.button>
        </div>

        <motion.div
          className="services-right"
          variants={servicesItemVariants}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{}}
          transition={{ duration: 0.8 }}
        >
          <div className="services-image-wrapper">
            <img
              src="https://html-templates.evonicmedia.com/adventurist/assets/images/index/services-img1.webp"
              alt="Adventure travelers"
              className="services-main-image"
            />
            <div className="services-camera-image">
              <img
                src="https://html-templates.evonicmedia.com/adventurist/assets/images/index/services-img2.webp"
                alt="Camera"
                className="camera-image"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
