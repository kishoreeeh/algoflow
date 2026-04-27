import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import AlgorithmList from './pages/AlgorithmList';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import Bookmarks from './pages/Bookmarks';
import PageTransition from './components/common/PageTransition';

/**
 * Main App Component
 *
 * Sets up routing with authentication pages, dashboard, bookmarks, and theme support.
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BookmarkProvider>
            <div className="min-h-screen">
              <AnimatedRoutes />
            </div>
          </BookmarkProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

/**
 * AnimatedRoutes - Wraps routes with AnimatePresence for page transitions
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><PageTransition><Home /></PageTransition><Footer /></>} />
        <Route path="/algorithms" element={<><Navbar /><PageTransition><AlgorithmList /></PageTransition><Footer /></>} />
        <Route path="/bookmarks" element={<><Navbar /><PageTransition><Bookmarks /></PageTransition><Footer /></>} />

        {/* Auth Routes (no navbar) */}
        <Route path="/login" element={<PageTransition variant="fade"><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition variant="fade"><Signup /></PageTransition>} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <><Navbar /><PageTransition><Dashboard /></PageTransition><Footer /></>
            </ProtectedRoute>
          }
        />
        <Route path="/algorithm/:algorithmId" element={<AlgorithmDetail />} />

        {/* Placeholder routes */}
        <Route path="/practice" element={<><Navbar /><PageTransition><ComingSoon page="Practice" /></PageTransition><Footer /></>} />
        <Route path="/about" element={<><Navbar /><PageTransition><ComingSoon page="About" /></PageTransition><Footer /></>} />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * ComingSoon Component
 */
const ComingSoon = ({ page }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] text-gray-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-200 mb-3">{page}</h1>
        <p className="text-gray-500 mb-6">This section is under development.</p>
        <a href="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors inline-block">
          Go Home
        </a>
      </div>
    </div>
  );
};

/**
 * Footer Component
 */
const Footer = () => {
  return (
    <footer className="bg-[#0a0f1a] border-t border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            AlgoFlow — Interactive DSA Learning Platform
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Docs</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Feedback</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
