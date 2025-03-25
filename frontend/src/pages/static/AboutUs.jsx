import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../../features/navigation/components/Navbar'; // Corrected path for Navbar
import { Footer } from '../../features/footer/Footer'; // Corrected path for Footer
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div style={{ backgroundColor: '#f8f9fa' }}>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(243, 105, 147, 0.9), rgba(115, 48, 217, 0.9))',
            height: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Floating Icons */}
          <div style={{ position: 'absolute', top: '100px', left: '40px', fontSize: '100px', color: '#fff', border: 'none' }}>
            🛒✨
          </div>
          <div style={{ position: 'absolute', bottom: '30px', right: '50px', fontSize: '300px', color: 'rgba(255, 255, 255, 0.1)' }}>
            🌟
          </div>

          <motion.div
            className="container text-center position-relative"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-3 text-white fw-bold mb-4" style={{ letterSpacing: '-1px' }}>
              About Us
            </h1>
            <p className="lead text-white mb-4" style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto' }}>
              Discover our story, mission, and the talented individuals behind bringing you the best online shopping experience.
            </p>
            <motion.a
              href="/shop"
              className="btn btn-light fw-bold px-4 py-2 shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Shop Now
            </motion.a>
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="container py-6 team-section">
          <h2 className="display-4 fw-bold text-center mb-5">Meet Our Team</h2>
          <div className="row g-4">
            {[
              {
                name: 'JAGADISH',
                role: 'CEO',
                avatar: 'https://res.cloudinary.com/docnp0ctp/image/upload/v1742923734/Apex-store/xd5q7pcjeymkvy5kkjos.jpg',
                bio: 'STUDENT',
              },
              {
                name: 'CHANDU CHOWDARY',
                role: 'CTO',
                avatar: 'https://res.cloudinary.com/docnp0ctp/image/upload/v1742924473/Apex-store/vfj8i9989v2gqwqtz6ds.jpg',
                bio: 'STUDENT',
              },
              {
                name: 'GREESHMAN SIVA',
                role: 'CFO',
                avatar: 'https://res.cloudinary.com/docnp0ctp/image/upload/v1742925342/Apex-store/adpqvradk4ul9lkz2mye.jpg',
                bio: 'STUDENT',
              },
              {
                name: 'DHANUSH',
                role: 'COO',
                avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
                bio: 'STUDENT',
              },
              {
                name: 'DEEPAK',
                role: 'CMO',
                avatar: 'https://res.cloudinary.com/docnp0ctp/image/upload/v1742924343/Apex-store/kkxq7gsxpcnlkcys76cb.jpg',
                bio: 'STUDENT',
              },
            ].map((member, index) => (
              <div className="col-md-4" key={index}>
                <motion.div
                  className="card border-0 shadow-lg h-100 text-center"
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="img-fluid"
                  />
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold">{member.name}</h5>
                    <p className="card-text text-muted">{member.role}</p>
                    <p className="card-text" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="container">
            <div className="row align-items-center">
              {/* Contact Text */}
              <div className="col-lg-6 text-white">
                <h2 className="display-4 fw-bold mb-4">Get in Touch</h2>
                <p className="lead mb-5" style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                  Have questions or need assistance? Our dedicated support team is here to help. Reach out to us anytime!
                </p>
                <Link
                  to="/contact"
                  className="btn btn-light btn-lg"
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Contact Us
                  <ArrowRight size={20} className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default AboutUs;