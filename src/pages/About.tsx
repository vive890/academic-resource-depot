
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Target, Award, Globe, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Educational Excellence',
      description: 'Curated collection of high-quality academic resources from verified educators and students worldwide.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by students, for students. Our platform thrives on collaborative learning and knowledge sharing.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Breaking down barriers to education by providing free access to resources regardless of geographical location.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every resource is reviewed and categorized to ensure relevance and educational value for learners.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Resources Shared' },
    { number: '5,000+', label: 'Active Students' },
    { number: '500+', label: 'Universities' },
    { number: '50+', label: 'Countries' }
  ];

  const values = [
    {
      title: 'Accessibility',
      description: 'Education should be accessible to everyone, everywhere, at any time.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Quality',
      description: 'We maintain high standards for all educational content on our platform.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Collaboration',
      description: 'Learning is better when we work together and share knowledge.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform with cutting-edge technology.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <Heart className="h-12 w-12 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About EduMart
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Empowering learners worldwide through accessible, high-quality educational resources. 
            Join our mission to democratize education and foster collaborative learning.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 animate-fade-in overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2"></div>
            <CardHeader className="text-center py-12">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Target className="h-20 w-20 text-blue-600 mb-6 animate-pulse" />
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    At EduMart, we believe that quality education should be accessible to everyone, 
                    regardless of their financial situation or geographical location. Our platform 
                    serves as a bridge connecting students, educators, and knowledge seekers from 
                    around the world.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We're committed to breaking down barriers and creating a more equitable educational landscape 
                    where knowledge flows freely and learning never stops.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">What We Offer</h3>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Free access to academic resources
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      Textbooks, notes, and study materials
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Subject-specific content organization
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      Global community of learners
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Smart search and discovery
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={value.title} 
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${value.gradient} group-hover:h-4 transition-all duration-300`}></div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Why Choose EduMart?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.label} 
                className="text-center animate-fade-in hover:scale-110 transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white animate-fade-in">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Be part of the educational revolution. Share your knowledge and learn from others.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/auth?mode=signup">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl flex items-center gap-2 mx-auto sm:mx-0">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/resources">
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto sm:mx-0">
                Browse Resources
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
