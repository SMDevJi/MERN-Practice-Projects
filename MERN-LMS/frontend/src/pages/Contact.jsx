import React from 'react';

const Contact = () => {
    return (
        <div className="container-wrapper min-h-[80vh] flex justify-center items-center p-6 bg-gray-50">
            <div className="contact-us-container w-full max-w-6xl bg-white shadow-md rounded-lg p-8">
                <h2 className="text-3xl font-semibold mb-4 text-gray-800">Contact Us</h2>
                <p className="text-gray-600 mb-8">
                    We're here to help. Reach out to our LMS support team using the form below.
                </p>

                <div className="contact-content flex flex-col md:flex-row gap-8">
                    
                    <form className="contact-form flex-1 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject of your message"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                name="message"
                                placeholder="Write your message here..."
                                rows="5"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md transition duration-200"
                        >
                            Send Message
                        </button>
                    </form>

                    
                    <div className="contact-info flex-1 bg-gray-100 rounded-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Contact Info</h3>
                        <p className="text-gray-700 mb-2">
                            <strong>Email:</strong> support@lms-platform.com
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Phone:</strong> +1 (800) 123-4567
                        </p>
                        <p className="text-gray-700">
                            <strong>Address:</strong> 123 Learning Lane, EduCity, Knowledge State
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
