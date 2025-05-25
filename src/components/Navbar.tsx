
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Menu, X, User, Upload, LogOut, Shield, Info } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleLogoClick = () => {
    if (user) {
      navigate('/resources');
    } else {
      navigate('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="flex items-center space-x-2 group">
              <BookOpen className="h-8 w-8 text-blue-600 transition-transform group-hover:scale-110 duration-300" />
              <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduMart
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/resources" 
              className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 ${
                isActive('/resources') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse Resources
            </Link>
            {!user && (
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 ${
                  isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Info className="inline w-4 h-4 mr-1" />
                About
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/upload" 
                  className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 ${
                    isActive('/upload') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Upload className="inline w-4 h-4 mr-1" />
                  Upload
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 ${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <User className="inline w-4 h-4 mr-1" />
                  Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-red-50 ${
                    isActive('/admin') ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <Shield className="inline w-4 h-4 mr-1" />
                  Admin
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    variant="outline"
                    className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isOpen ? 
                <X className="h-6 w-6 transition-transform duration-200 rotate-90" /> : 
                <Menu className="h-6 w-6 transition-transform duration-200" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mb-2">
            <Link 
              to="/resources" 
              className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                isActive('/resources') ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Browse Resources
            </Link>
            {!user && (
              <Link 
                to="/about" 
                className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive('/about') ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/upload" 
                  className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive('/upload') ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Upload
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive('/admin') ? 'text-red-600 bg-red-100' : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth?mode=signup" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
