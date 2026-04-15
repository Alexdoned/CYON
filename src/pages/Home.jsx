import React from "react";
import { Link } from "react-router-dom";
import { Users, Heart, Zap, ArrowRight } from "lucide-react";
import logo from "/cyonlogo.png";

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Catholic Youth Organization of Nigeria
              </h1>
              <p className="text-xl text-green-100">
                Jalingo Diocese - Building Faith, Community, and Service
              </p>
              <p className="text-lg text-green-50 leading-relaxed">
                Join thousands of young Catholics in the Jalingo Diocese working
                together to strengthen our faith and serve our communities with
                passion and purpose.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-800 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors duration-200"
                >
                  Register Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-green-800 transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden md:flex justify-center">
              <img
                src={logo}
                alt="CYON Logo"
                className="w-64 h-64 drop-shadow-2xl animate-bounce"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-16">
            Why Join CYON?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4 p-3 bg-green-100 rounded-full">
                <Users className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Community
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with thousands of young Catholics across the Jalingo
                Diocese and build meaningful relationships.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4 p-3 bg-green-100 rounded-full">
                <Heart className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Service
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Make a real impact through various outreach programs and
                community service initiatives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4 p-3 bg-green-100 rounded-full">
                <Zap className="w-8 h-8 text-green-800" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Develop your spiritual faith, leadership skills, and personal
                growth through our programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Denaries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-16">
            Our Denaries
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Bali",
              "Kofai",
              "Jalingo",
              "Zing",
              "Kpantisawa",
              "Yakoko",
              "Olqp",
            ].map((denary) => (
              <div
                key={denary}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <h3 className="text-lg font-bold text-green-800">{denary}</h3>
                <p className="text-gray-600 text-sm mt-2">Denary</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Join Our Community?</h2>
          <p className="text-xl text-green-100">
            Register today and become part of a vibrant community of faith and
            service.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-green-800 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition-colors duration-200 text-lg"
          >
            Start Your Registration
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">About CYON</h4>
              <p className="text-sm leading-relaxed">
                Catholic Youth Organization of Nigeria - Jalingo Diocese
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/register" className="hover:text-white transition-colors">
                    Register
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <p className="text-sm">Jalingo Diocese, Taraba State, Nigeria</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2024 CYON Jalingo Diocese. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
