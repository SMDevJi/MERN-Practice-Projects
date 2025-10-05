import React from 'react';
import { FaRobot, FaChartBar, FaUserCheck, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>

      <p className="text-lg text-gray-600 ">
        <strong className="text-blue-600">ChronoHire</strong> is an AI-powered interview preparation platform. We help candidates simulate interviews, generate tailored questions from resumes and job roles, evaluate answers using AI, and track performance with insightful visual analytics.
      </p>

      
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 What We Offer</h2>
        <ul className="space-y-6">
          <li className="flex items-start space-x-4">
            <FaFileAlt className="text-blue-500 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Resume & Role-Based Customization</h3>
              <p className="text-gray-600">
                Upload your resume and select a job role. Our AI analyzes your profile and creates relevant questions based on your experience and target position.
              </p>
            </div>
          </li>

          <li className="flex items-start space-x-4">
            <FaRobot className="text-green-500 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">AI-Generated Questions</h3>
              <p className="text-gray-600">
                Leverage artificial intelligence to generate real-world technical and behavioral interview questions tailored to your field.
              </p>
            </div>
          </li>

          <li className="flex items-start space-x-4">
            <FaUserCheck className="text-yellow-500 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Smart Answer Evaluation</h3>
              <p className="text-gray-600">
                Upload your spoken answers. Our AI evaluates clarity, accuracy, and delivery to give instant, constructive feedback.
              </p>
            </div>
          </li>

          <li className="flex items-start space-x-4">
            <FaChartBar className="text-cyan-500 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Performance Analytics</h3>
              <p className="text-gray-600">
                Visualize your progress with interactive charts and graphs that show your strengths and improvement areas over time.
              </p>
            </div>
          </li>
        </ul>
      </section>

      

      
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Our Mission</h2>
        <p className="text-gray-600">
          We're on a mission to empower job seekers with intelligent, accessible, and personalized interview preparation tools that help them succeed in today’s fast-paced job market.
        </p>
      </section>

      
      <section className="mt-12 bg-blue-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">📈 Ready to Improve Your Interview Skills?</h2>
        <p className="text-blue-600 mb-4">
          Sign up now to start your personalized AI-powered interview prep journey.
        </p>
        <Link 
          to="/signup"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default About;
