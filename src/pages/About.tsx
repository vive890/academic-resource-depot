
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Target, Award, Globe, Heart } from 'lucide-react';

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

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Former Stanford professor with 15+ years in educational technology.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      description: 'Full-stack developer passionate about democratizing education through technology.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Community',
      description: 'Student advocate ensuring our platform serves the global learning community.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About EduMart
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Empowering learners worldwide through accessible, high-quality educational resources. 
            Join our mission to democratize education and foster collaborative learning.
          </p>
          <div className="flex justify-center">
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Target className="h-16 w-16 text-blue-600 mb-4 animate-pulse" />
                  <p className="text-lg text-gray-700 leading-relaxed">
                    At EduMart, we believe that quality education should be accessible to everyone, 
                    regardless of their financial situation or geographical location. Our platform 
                    serves as a bridge connecting students, educators, and knowledge seekers from 
                    around the world.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">What We Offer</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✨ Free access to academic resources</li>
                    <li>📚 Textbooks, notes, and study materials</li>
                    <li>🎯 Subject-specific content organization</li>
                    <li>🌐 Global community of learners</li>
                    <li>🔍 Smart search and discovery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Why Choose EduMart?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={member.name} 
                className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the educational revolution. Share your knowledge and learn from others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth?mode=signup" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started Today
            </a>
            <a 
              href="/resources" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              Browse Resources
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
