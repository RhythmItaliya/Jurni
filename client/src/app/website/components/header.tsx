'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

const navVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function Header() {
  const router = useRouter();
  return (
    <motion.header
      className="website-header"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <motion.div
        className="container header-inner"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      >
        <div className="header-left">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              delay: 0.5,
            }}
          >
            <Link href="/" className="auth-logo-placeholder">
              Jurni
            </Link>
          </motion.div>
        </div>

        <motion.nav
          className="site-nav header-center"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Link href="/contact">Contact</Link>
          </motion.div>
          <motion.div
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Link href="/about">About</Link>
          </motion.div>
          <motion.div
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Link href="/website/vision">Our Vision</Link>
          </motion.div>
        </motion.nav>

        <div className="header-right">
          <motion.div
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <ThemeToggle />
          </motion.div>
          <motion.div
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Button
              variant="outline"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
          </motion.div>
          <motion.div
            variants={itemVariants}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Button
              variant="primary"
              onClick={() => router.push('/auth/register')}
            >
              Sign Up
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.header>
  );
}
