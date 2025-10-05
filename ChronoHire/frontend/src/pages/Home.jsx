import React from 'react';
import { FaRobot, FaFileUpload, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Smarter Interview Preparation with AI
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Upload your resume, select a role, and let AI simulate and evaluate your interview — instantly.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded shadow hover:bg-gray-100 "
          >
            Get Started For Free
          </Link>
        </div>
      </section>

      
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex space-x-4">
              <FaFileUpload className="text-4xl text-blue-500" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Resume-Based Customization</h3>
                <p className="text-gray-600">
                  Upload your resume and target role — our AI builds interview questions tailored to your background.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <FaRobot className="text-4xl text-green-500" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">AI-Driven Question Generation</h3>
                <p className="text-gray-600">
                  Generate technical and behavioral interview questions using real-time AI models.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <FaLightbulb className="text-4xl text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Smart Answer Evaluation</h3>
                <p className="text-gray-600">
                  Our AI evaluates your responses for correctness, clarity, and confidence. Get detailed feedback instantly.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <FaChartLine className="text-4xl text-cyan-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Insightful Analytics</h3>
                <p className="text-gray-600">
                  Visual performance reports with graphs help you understand your progress and focus areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 px-6 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-left">
            <div>
              <span className="text-blue-600 font-bold text-lg">1. Upload Resume</span>
              <p className="text-gray-600 mt-2">Drag and drop or upload your resume file (PDF, DOCX).</p>
            </div>
            <div>
              <span className="text-blue-600 font-bold text-lg">2. Choose Role</span>
              <p className="text-gray-600 mt-2">Pick your target job title or career domain.</p>
            </div>
            <div>
              <span className="text-blue-600 font-bold text-lg">3. Start Interview</span>
              <p className="text-gray-600 mt-2">Get real-time questions and respond via voice.</p>
            </div>
            <div>
              <span className="text-blue-600 font-bold text-lg">4. Get Feedback</span>
              <p className="text-gray-600 mt-2">Receive instant AI evaluation and visual performance reports.</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-blue-600 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Start Practicing Smarter, Not Harder</h2>
          <p className="text-lg mb-8">
            Join thousands of job seekers using AI to upgrade their interview skills and land dream roles.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded hover:bg-gray-100"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
