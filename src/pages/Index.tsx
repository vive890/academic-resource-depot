
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import { BookOpen, FileText, Presentation, Folder, Search, Upload, Download } from 'lucide-react';

const Index = () => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Academic Resource Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Share and discover educational materials. Upload books, notes, presentations, 
            and projects. Download resources completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resources">
              <Button size="lg" variant="secondary" className="text-blue-600">
                Browse Resources
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Join EduMart
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Resource Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the educational materials you need across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.title} to="/resources">
                <CategoryCard {...category} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EduMart?
            </h2>
            <p className="text-xl text-gray-600">
              The simplest way to share and access educational resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students and educators sharing knowledge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg">
                Create Account
              </Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline">
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
