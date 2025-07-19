import React from 'react';
import { Container } from 'react-bootstrap';
import AdSenseAd from './components/AdSenseAd';

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Header - Black background with white text on left - Mobile Optimized */}
      <div className="bg-dark text-white py-3 header-mobile">
        <Container>
          <h3 className="header-mobile" style={{ fontSize: '1.5rem', fontWeight: 'normal', margin: 0 }}>
            Privacy Policy
          </h3>
        </Container>
      </div>

      {/* Google AdSense - Below Header - Mobile Optimized */}
      <Container className="my-4 adsense-container">
        <AdSenseAd />
      </Container>

      <Container className="py-4">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p><strong>Last updated: January 2025</strong></p>

          <h4>Your Privacy Matters to Us</h4>
          <p>
            At PickMeTrend, we are committed to protecting your privacy and ensuring a safe browsing experience. 
            This privacy policy outlines how we collect, use, and protect your information.
          </p>

          <h4>Information We Collect</h4>
          <ul>
            <li>Basic analytics data (page views, click tracking)</li>
            <li>No personal information is stored or collected</li>
          </ul>

          <h4>How We Use Information</h4>
          <ul>
            <li>Improve website performance and user experience</li>
            <li>Track product popularity and trends</li>
            <li>Provide relevant product recommendations</li>
          </ul>

          <h4>Third-Party Services</h4>
          <ul>
            <li><strong>Amazon Associates Program:</strong> We earn commissions from qualifying purchases</li>
            <li><strong>Google AdSense:</strong> We display advertisements on our website</li>
            <li><strong>Analytics Services:</strong> We use analytics to improve our website</li>
          </ul>

          <h4>Data Protection</h4>
          <p>
            We do not sell, trade, or share your personal information with third parties. 
            All data is handled in accordance with applicable privacy laws and regulations.
          </p>

          <h4>Cookies</h4>
          <p>
            We use cookies to improve your browsing experience and for analytics purposes. You can control 
            cookie settings through your browser preferences.
          </p>

          <h4>Contact Us</h4>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@pickmetrend.com<br/>
            <strong>Response Time:</strong> We aim to respond within 48 hours
          </p>

          <h4>Policy Updates</h4>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page 
            with an updated "Last modified" date.
          </p>

          <div className="text-center mt-4">
            <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
              ← Back to Home
            </a>
          </div>
        </div>
      </Container>

      {/* Google AdSense - Above Footer - Mobile Optimized */}
      <Container className="my-4 adsense-container">
        <AdSenseAd />
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
