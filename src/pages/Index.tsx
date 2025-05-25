
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import { BookOpen, FileText, Presentation, Folder, Search, Upload, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/resources');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render landing page for authenticated users
  if (user) {
    return null;
  }

  const categories = [
    {
      title: 'Books',
      description: 'Academic textbooks and reference materials',
      icon: BookOpen,
    },
    {
      title: 'Notes',
      description: 'Study notes and lecture summaries',
      icon: FileText,
    },
    {
      title: 'PPTs',
      description: 'PowerPoint presentations and slides',
      icon: Presentation,
    },
    {
      title: 'Projects',
      description: 'Academic projects and assignments',
      icon: Folder,
    },
  ];

  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Upload your educational materials in various formats (PDF, DOC, PPT, ZIP)',
    },
    {
      icon: Download,
      title: 'Free Downloads',
      description: 'Download any resource completely free with no restrictions',
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find resources by subject, course, category, or file type',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Your Academic Resource Hub
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed opacity-90">
              Share and discover educational materials. Upload books, notes, presentations, 
              and projects. Download resources completely free and accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/resources">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Browse Resources
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  Join EduMart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Explore Resource Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the educational materials you need across different categories and subjects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={category.title} to="/resources" className="group">
                <div className="animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CategoryCard {...category} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Why Choose EduMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The simplest way to share and access educational resources worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white animate-fade-in">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Join thousands of students and educators sharing knowledge across the globe
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Create Account
              </Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                Browse Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
