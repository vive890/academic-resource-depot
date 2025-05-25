import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Menu, X, User, Upload, LogOut, Shield } from 'lucide-react';

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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="flex items-center space-x-3 group">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 h-8 w-8 bg-blue-600 rounded-full opacity-20 scale-0 group-hover:scale-150 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold gradient-text">
                EduMart
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/resources" 
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                isActive('/resources') 
                  ? 'text-blue-600 bg-blue-50 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              Browse Resources
            </Link>
            
            {!user && (
              <Link 
                to="/about" 
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive('/about') 
                    ? 'text-blue-600 bg-blue-50 shadow-sm' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                About
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/upload" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/upload') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/admin') 
                      ? 'text-red-600 bg-red-50 shadow-sm' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="ml-2 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border-gray-300"
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
                    className="ml-2 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border-gray-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg btn-shimmer">
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
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 p-2 rounded-lg hover:bg-blue-50"
            >
              {isOpen ? 
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" /> : 
                <Menu className="h-6 w-6 transition-transform duration-300" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-4 space-y-2 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl mt-2 backdrop-blur-sm">
            <Link 
              to="/resources" 
              className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                isActive('/resources') 
                  ? 'text-blue-600 bg-blue-100/70' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Browse Resources
            </Link>
            
            {!user && (
              <Link 
                to="/about" 
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  isActive('/about') 
                    ? 'text-blue-600 bg-blue-100/70' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
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
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/upload') 
                      ? 'text-blue-600 bg-blue-100/70' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Upload
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 bg-blue-100/70' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/admin') 
                      ? 'text-red-600 bg-red-100/70' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
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
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth?mode=signup" 
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 font-medium"
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
