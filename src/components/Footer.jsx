import React from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsGithub, BsLinkedin, BsTwitter } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Logo & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-6">
          {/* LMS Branding */}
          <div>
            <h2 className="text-2xl font-bold text-white">LMS Platform</h2>
            <p className="text-sm mt-2">
              Empowering students with online learning. Learn at your own pace, anytime, anywhere.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <p className="mt-3 text-sm">Email: support@lms.com</p>
            <p className="text-sm">Phone: +91 123 456 7890</p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex justify-center items-center gap-6 mt-6">
          <Link to="https://www.facebook.com/john.doe.123" target="_blank" className="text-gray-400 hover:text-white text-2xl">
            <BsFacebook />
          </Link>
          <Link to="https://www.linkedin.com/in/johndoe123" target="_blank" className="text-gray-400 hover:text-white text-2xl">
            <BsLinkedin />
          </Link>
          <Link to="https://github.com/JohnDoe123" target="_blank" className="text-gray-400 hover:text-white text-2xl">
            <BsGithub />
          </Link>
          <Link to="https://twitter.com/JohnDoe123" target="_blank" className="text-gray-400 hover:text-white text-2xl">
            <BsTwitter />
          </Link>
        </div>

        {/* Bottom Copyright Section */}
        <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} LMS Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
