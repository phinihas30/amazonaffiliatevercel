import FlappyBirdGame from './FlappyBirdGame';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import AdSenseAd from './components/AdSenseAd';

// API Base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/`)
      .then(response => {
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]); // Set empty array as fallback
        }
      })
      .catch(error => {
        setProducts([]); // Set empty array as fallback
      });
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="brand-text">PickMeTrend Deals</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Google AdSense Header Ad */}
      <div className="adsense-header" style={{
        textAlign: 'center',
        padding: '10px 0',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6'
      }}>
        <AdSenseAd
          client="ca-pub-3925708528499289" // Your AdSense client ID
          slot="XXXXXXXXXX" // Replace with your ad slot ID
          style={{ display: 'block', width: '100%', height: '90px' }}
          format="horizontal"
          responsive={true}
          className="header-ad"
        />
      </div>

      <FlappyBirdGame />

      <Container className="mt-5">
        <div className="d-flex justify-content-end mb-3" style={{ position: 'relative', alignItems: 'flex-start' }}>
          <span
            style={{ cursor: 'pointer', fontWeight: 'normal', marginRight: 0, fontSize: '1rem', color: '#333', userSelect: 'none' }}
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            Sort by
          </span>
          {showSortDropdown && (
            <select
              className="form-select"
              style={{ width: '180px', position: 'absolute', right: 0, top: '28px', zIndex: 10, fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              onChange={(e) => {
                const value = e.target.value;
                let url = `${API_BASE_URL}/api/products/`;
                if (value === 'newest') {
                  url += '?ordering=-created_at';
                } else if (value === 'price_asc') {
                  url += '?ordering=price';
                } else if (value === 'price_desc') {
                  url += '?ordering=-price';
                }
                axios.get(url)
                  .then(response => {
                    // Ensure response.data is an array
                    if (Array.isArray(response.data)) {
                      setProducts(response.data);
                    } else {
                      setProducts([]); // Set empty array as fallback
                    }
                    setShowSortDropdown(false); // Hide dropdown after selection
                  })
                  .catch(error => {
                    setProducts([]); // Set empty array as fallback
                  });
              }}
              defaultValue=""
            >
              <option value="" disabled>Choose...</option>
              <option value="newest">Recently Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          )}
        </div>
        <Row>
          {currentProducts.map(product => (
            <Col key={product.id} sm={12} md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div style={{ position: 'relative' }}>
                  <Card.Img 
                    variant="top" 
                    src={product.product_image_link} 
                    style={{ objectFit: 'contain', height: '220px', background: '#fff' }}
                  />
                  <Button 
                    variant="light" 
                    className="rounded-circle"
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        `Check out this product: ${product.name} - ${product.affiliate_full_link}\nFind more deals at: https://www.pickmetrend.com`
                      )}`,
                      '_blank'
                    )}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                      <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                    </svg>
                  </Button>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted">₹{product.price}</Card.Text>
                  <p className="text-success small">A PickMeTrend Recommended Deal</p>
                  <Button variant="outline-primary" href={`${API_BASE_URL}/api/track-product-click/${product.id}/`} target="_blank" className="mt-auto rounded-pill">
                    View on Amazon
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </Container>

      <footer className="bg-dark text-white mt-5 p-4 text-center">
        <p>&copy; 2025 PickMeTrend. All Rights Reserved.</p>
        <p style={{fontSize: '0.95em', marginTop: '8px'}}>
          <strong>Privacy Policy:</strong> Your privacy is important to us. We collect only the information necessary to provide our services and do not sell or share your personal data with third parties, except as required by law. For more information, please contact our support team.
        </p>
      </footer>
    </div>
  );
}

export default App;
