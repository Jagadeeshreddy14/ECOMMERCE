import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import '../styles/ContactUs.css';
import { Navbar } from '../features/navigation/components/Navbar';
import { Footer } from '../features/footer/Footer';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success notification
      toast.success('Message sent successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="bg-gray-50 min-h-screen">
        <div className="hero-section">
          <div className="container mx-auto text-center px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-in-up">
              Have questions or want to learn more about our services? Contact us today and our team will be happy to assist you.
            </p>
          </div>
        </div>

        {/* Update Contact Info Cards */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address Card */}
            <a
              href="https://maps.app.goo.gl/9FvsMQLQYLufkYnZ7"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card bg-white shadow-md hover:shadow-lg transition-shadow p-8 text-center mt-6 rounded-lg"
            >
              <div className="icon-container">
                <MapPin size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Address</h3>
              <p className="text-gray-600">Kalasalingam University,Krishnan Kovil, Srivilliputhur, Tamil Nadu 626126</p>
            </a>

            {/* Phone Card */}
            <div className="contact-card bg-white shadow-md hover:shadow-lg transition-shadow p-8 text-center mt-6 rounded-lg">
              <div className="icon-container">
                <Phone size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+918074563501</p>
            </div>

            {/* Email Card */}
            <a
              href="mailto:info@apexstore.com"
              className="contact-card bg-white shadow-md hover:shadow-lg transition-shadow p-8 text-center mt-6 rounded-lg"
            >
              <div className="icon-container">
                <Mail size={40} className="text-green-600" />
              </div>a
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">info@apexstore.com</p>
            </a>
          </div>
        </div>

        {/* Enhanced Contact Form */}
        <div className="container mx-auto px-4 py-6 mt-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-sm shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-center mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <div className="text-center btn-success">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className=""
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer here */}
    </>
  );
};

export default ContactUs;