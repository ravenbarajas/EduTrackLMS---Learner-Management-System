import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import { useAuth } from "@/lib/auth-context";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleDemoLogin = async () => {
    // Auto-login as demo user
    const success = await login("john.doe@company.com", "password123");
    if (success) {
      setLocation("/dashboard");
    }
  };

  const features = [
    {
      icon: "fas fa-video",
      title: "Rich Media Support",
      description: "Embed videos, documents, and interactive content seamlessly within your course modules.",
      color: "bg-blue-500"
    },
    {
      icon: "fas fa-puzzle-piece", 
      title: "Modular Design",
      description: "Create flexible learning paths with drag-and-drop course building and reusable components.",
      color: "bg-purple-500"
    },
    {
      icon: "fas fa-chart-line",
      title: "Progress Tracking", 
      description: "Monitor learner progress with detailed analytics and exportable reports for administrators.",
      color: "bg-emerald-500"
    },
    {
      icon: "fas fa-gamepad",
      title: "Gamification",
      description: "Boost engagement with badges, leaderboards, and achievement systems that motivate learners.",
      color: "bg-amber-500"
    },
    {
      icon: "fas fa-certificate",
      title: "Certifications",
      description: "Generate professional certificates with customizable templates and automated delivery.",
      color: "bg-violet-500"
    },
    {
      icon: "fas fa-users",
      title: "Role Management", 
      description: "Flexible user roles for learners, instructors, and administrators with customizable permissions.",
      color: "bg-rose-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "L&D Director, TechCorp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      text: "SkillNest transformed our employee training program. The modular approach allows us to create targeted learning paths for different departments."
    },
    {
      name: "Maria Rodriguez", 
      role: "Director, Innovation Academy",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      text: "The gamification features increased our completion rates by 300%. Students love earning badges and competing on leaderboards."
    },
    {
      name: "James Wilson",
      role: "Training Manager, Global Solutions", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      text: "Creating courses is incredibly intuitive. The drag-and-drop builder saved us weeks of development time compared to our previous solution."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 lg:py-32 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Transform Your Team with{" "}
                <span className="text-blue-500">Modular Learning</span>
              </h1>
              <p className="text-xl text-slate-600 mt-6 leading-relaxed">
                Create, deliver, and track personalized training modules with rich media support, 
                gamification, and certifications for corporate L&D and training institutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-blue-500 hover:bg-blue-600"
                  onClick={handleDemoLogin}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={handleDemoLogin}
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center mt-8 space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <i className="fas fa-check text-emerald-500 mr-2"></i>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-emerald-500 mr-2"></i>
                  14-day free trial
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="shadow-2xl">
                <CardContent className="p-6">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                    alt="Learning dashboard interface" 
                    className="rounded-xl w-full" 
                  />
                  <Badge className="absolute -top-4 -right-4 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-sm font-semibold">
                    <i className="fas fa-trophy mr-2"></i>
                    Certificate Earned!
                  </Badge>
                  <Card className="absolute -bottom-4 -left-4 shadow-lg">
                    <CardContent className="p-4">
                      <div className="text-sm text-slate-600">Course Progress</div>
                      <div className="flex items-center mt-1">
                        <div className="bg-blue-500 h-2 rounded-full w-16"></div>
                        <div className="bg-slate-200 h-2 rounded-full ml-1 w-5"></div>
                        <span className="ml-2 text-sm font-semibold text-slate-900">75%</span>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Everything you need for modern learning
            </h2>
            <p className="text-xl text-slate-600 mt-4 max-w-3xl mx-auto">
              Powerful tools designed for training institutes and corporate L&D teams 
              to create engaging learning experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-50 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                    <i className={`${feature.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Trusted by leading organizations
            </h2>
            <p className="text-xl text-slate-300 mt-4">
              See how companies are transforming their training programs
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-slate-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your training program?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations already using SkillNest to deliver exceptional learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6"
              onClick={handleDemoLogin}
            >
              Request Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-500"
              onClick={handleDemoLogin}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-graduation-cap text-blue-500 text-2xl mr-2"></i>
                <span className="text-xl font-bold text-white">SkillNest</span>
              </div>
              <p className="text-slate-400">
                Empowering organizations with modular learning solutions for the modern workforce.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "API"]
              },
              {
                title: "Company", 
                links: ["About", "Careers", "Contact", "Blog"]
              },
              {
                title: "Support",
                links: ["Help Center", "Privacy Policy", "Terms of Service", "Status"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 SkillNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
