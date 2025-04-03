import React from 'react';
import HeroSection from './HeroSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="text-orange-500 font-bold text-xl">E-Learning</div>
        <div>
          <button className="bg-teal-500 text-white px-4 py-2 rounded mr-2">
            Explore Courses
          </button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded">
            Q&A
          </button>
        </div>
      </header>

      {/* Main Section with HeroSection */}
      <main className="relative">
        <HeroSection />
      </main>

      {/* Courses Section */}
      <section className="p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Our Courses</h2>
        {/* Add your course cards here */}
      </section>
    </div>
  );
};

export default Home;