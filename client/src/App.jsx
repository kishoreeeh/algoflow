import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import AlgorithmList from './pages/AlgorithmList';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';

/**
 * Main App Component
 *
 * Sets up routing with authentication pages, dashboard, and theme support.
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/algorithms" element={<><Navbar /><AlgorithmList /><Footer /></>} />

              {/* Auth Routes (no navbar) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <><Navbar /><Dashboard /><Footer /></>
                  </ProtectedRoute>
                }
              />
              <Route path="/algorithm/:algorithmId" element={<AlgorithmDetail />} />

              {/* Placeholder routes */}
              <Route path="/practice" element={<><Navbar /><ComingSoon page="Practice" /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><ComingSoon page="About" /><Footer /></>} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

/**
 * ComingSoon Component
 */
const ComingSoon = ({ page }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-[#f8fafc]">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-4xl font-bold text-white mb-4">{page} Coming Soon!</h1>
        <p className="text-xl text-gray-400 mb-8">
          We're working hard to bring you this feature.
        </p>
        <a href="/" className="btn-primary">
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
    <footer className="bg-[#0f172a] border-t border-[#334155] mt-20">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">
              © 2026 Algo Flow. Built with ❤️ for learners.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#10b981] transition-colors">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-[#10b981] transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-400 hover:text-[#10b981] transition-colors">
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
