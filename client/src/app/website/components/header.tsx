'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const navVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Header() {
  const router = useRouter();
  return (
    <motion.header
      className="website-header"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <motion.div className="container header-inner">
        <motion.div className="header-left" variants={itemVariants}>
          <motion.div variants={logoVariants}>
            <Link href="/" className="auth-logo-placeholder">
              Jurni
            </Link>
          </motion.div>
        </motion.div>

        <motion.nav className="site-nav header-center" variants={navVariants}>
          <motion.div variants={itemVariants}>
            <Link href="/">Home</Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/contact">Contact</Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/about">About</Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/website/vision">Our Vision</Link>
          </motion.div>
        </motion.nav>

        <motion.div className="header-right" variants={navVariants}>
          <motion.div variants={itemVariants}>
            <motion.button
              className="header-text-button"
              onClick={() => router.push('/auth/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.button
              className="header-text-button"
              onClick={() => router.push('/auth/register')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
