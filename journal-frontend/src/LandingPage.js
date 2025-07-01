import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col justify-center items-center px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 typewriter">
        Welcome to your journal
      </h1>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/journal')}
        className="mt-4 px-6 py-3 text-lg bg-indigo-500 text-white font-semibold rounded-xl shadow-lg sparkle-hover"
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
