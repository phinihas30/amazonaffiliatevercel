import React from 'react';
import { Container } from 'react-bootstrap';
import AdSenseAd from './components/AdSenseAd';

const AboutUs = () => {
  return (
    <div>
      {/* Header - Black background with white text on left - Mobile Optimized */}
      <div className="bg-dark text-white py-3 header-mobile">
        <Container>
          <h3 className="header-mobile" style={{ fontSize: '1.5rem', fontWeight: 'normal', margin: 0 }}>
            About PickMeTrend
          </h3>
        </Container>
      </div>

      {/* Google AdSense - Below Header - Mobile Optimized */}
      <Container className="my-4 adsense-container">
        <AdSenseAd />
      </Container>

      <Container className="py-4">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h4>Who We Are</h4>
          <p>
            <strong>PickMeTrend</strong> is your trusted destination for discovering the best Amazon deals and products. 
            We specialize in curating high-quality, trending products across various categories including electronics, 
            gaming, home & garden, fashion, and lifestyle accessories.
          </p>

          <h4>Our Mission</h4>
          <p>
            Our mission is to help you make informed purchasing decisions by providing detailed product reviews, 
            honest pros and cons analysis, and competitive pricing information. We partner with Amazon as affiliates 
            to bring you exclusive deals and ensure you get the best value for your money.
          </p>

          <h4>What We Offer</h4>
          <ul>
            <li>Carefully curated product selections</li>
            <li>Detailed product reviews and ratings</li>
            <li>Honest pros and cons analysis</li>
            <li>Competitive price tracking</li>
            <li>Direct links to Amazon for secure purchasing</li>
            <li>Regular updates on trending products</li>
          </ul>

          <h4>Contact Us</h4>
          <p>
            Have questions about our reviews or suggestions for products you'd like us to evaluate? 
            We'd love to hear from you!
          </p>
          <p>
            <strong>Email:</strong> support@pickmetrend.com<br/>
            <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
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

export default AboutUs;
