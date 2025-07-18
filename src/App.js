import FlappyBirdGame from './FlappyBirdGame';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Pagination, Modal } from 'react-bootstrap';
import AdSenseAd from './components/AdSenseAd';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';

// API Base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://amazonaffiliate-production.up.railway.app';

// HomePage Component
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      })
      .catch(error => {
        setProducts([]);
      });
  }, []);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      {/* Header - Black background with white text on left */}
      <div className="bg-dark text-white py-3">
        <Container>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'normal', margin: 0 }}>
            PickMeTrend Deals
          </h3>
        </Container>
      </div>

      {/* Flappy Bird Game - Right below header */}
      <Container>
        <FlappyBirdGame />
      </Container>

      {/* Google AdSense */}
      <Container className="my-4">
        <AdSenseAd />
      </Container>

      <Container className="my-4">
        {/* Sort Controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <label className="form-label mb-0 me-2 fw-semibold text-muted" style={{ fontSize: '0.9rem' }}>
                Sort by:
              </label>
              <select
                className="form-select form-select-sm"
                style={{ 
                  width: '200px', 
                  fontSize: '0.9rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  let sortedUrl = `${API_BASE_URL}/api/products/`;
                  if (value === 'newest') {
                    sortedUrl += '?ordering=-created_at';
                  } else if (value === 'price_asc') {
                    sortedUrl += '?ordering=price';
                  } else if (value === 'price_desc') {
                    sortedUrl += '?ordering=-price';
                  } else if (value === 'rating_desc') {
                    sortedUrl += '?ordering=-rating';
                  } else if (value === 'featured') {
                    sortedUrl += '?ordering=-is_featured,-rating';
                  }
                  
                  axios.get(sortedUrl)
                    .then(response => {
                      if (Array.isArray(response.data)) {
                        setProducts(response.data);
                        setCurrentPage(1);
                      } else {
                        setProducts([]);
                      }
                    })
                    .catch(error => {
                      setProducts([]);
                    });
                }}
                defaultValue=""
              >
                <option value="" disabled>Select sorting option</option>
                <option value="featured">⭐ Featured First</option>
                <option value="rating_desc">⭐ Highest Rated</option>
                <option value="newest">🕒 Recently Added</option>
                <option value="price_asc">💰 Price: Low to High</option>
                <option value="price_desc">💰 Price: High to Low</option>
              </select>
            </div>
            
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              <span className="badge bg-light text-dark">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">View:</small>
            <div className="btn-group btn-group-sm" role="group">
              <button type="button" className="btn btn-outline-secondary active" title="Grid View">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                </svg>
              </button>
              <button type="button" className="btn btn-outline-secondary" title="List View" disabled>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Debug info */}
        <div className="mb-3">
          <small className="text-muted">
            Debug: Total products: {products.length}, Current page products: {currentProducts.length}
          </small>
        </div>
        
        <Row>
          {currentProducts.length === 0 ? (
            <Col className="text-center">
              <p>No products found. Check console for errors.</p>
            </Col>
          ) : (
            currentProducts.map(product => (
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                      </svg>
                    </Button>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted">₹{product.price}</Card.Text>
                    
                    {/* Star Rating */}
                    {product.rating && (
                      <div className="mb-2">
                        <span className="text-warning" style={{ fontSize: '1.2em' }}>
                          {product.star_rating}
                        </span>
                        <small className="text-muted ms-2">({product.rating}/5)</small>
                      </div>
                    )}
                    
                    {/* Review Title */}
                    {product.review_title && (
                      <h6 className="text-primary mb-2">{product.review_title}</h6>
                    )}
                    
                    {/* Review Summary */}
                    {product.review_summary && (
                      <p className="small text-muted mb-2" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.review_summary}
                      </p>
                    )}
                    
                    {/* Pros */}
                    {product.pros_list && product.pros_list.length > 0 && (
                      <div className="mb-2">
                        <small className="text-success fw-bold">✓ Pros:</small>
                        <ul className="small text-success mb-1" style={{ paddingLeft: '1rem' }}>
                          {product.pros_list.slice(0, 2).map((pro, index) => (
                            <li key={index} style={{ fontSize: '0.75rem' }}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Cons */}
                    {product.cons_list && product.cons_list.length > 0 && (
                      <div className="mb-2">
                        <small className="text-danger fw-bold">✗ Cons:</small>
                        <ul className="small text-danger mb-1" style={{ paddingLeft: '1rem' }}>
                          {product.cons_list.slice(0, 2).map((con, index) => (
                            <li key={index} style={{ fontSize: '0.75rem' }}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {product.is_featured && (
                      <span className="badge bg-warning text-dark mb-2" style={{ fontSize: '0.7rem' }}>
                        ⭐ Featured
                      </span>
                    )}
                    
                    <p className="text-success small">A PickMeTrend Recommended Deal</p>
                    
                    {/* Action Buttons */}
                    <div className="d-flex gap-2 mt-auto">
                      {product.has_review && (
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowReviewModal(true);
                          }}
                          className="flex-fill"
                        >
                          Read Review
                        </Button>
                      )}
                      <Button 
                        variant="outline-primary" 
                        href={`${API_BASE_URL}/api/track-product-click/${product.id}/`} 
                        target="_blank" 
                        className="flex-fill rounded-pill"
                        size="sm"
                      >
                        View on Amazon
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.review_title || selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              {/* Product Info */}
              <div className="d-flex align-items-center mb-3">
                <img
                  src={selectedProduct.product_image_link}
                  alt={selectedProduct.name}
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  className="me-3"
                />
                <div>
                  <h6>{selectedProduct.name}</h6>
                  <p className="text-muted mb-1">₹{selectedProduct.price}</p>
                  {selectedProduct.rating && (
                    <div>
                      <span className="text-warning">{selectedProduct.star_rating}</span>
                      <small className="text-muted ms-2">({selectedProduct.rating}/5)</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Summary */}
              {selectedProduct.review_summary && (
                <div className="mb-3">
                  <h6 className="text-primary">Review Summary</h6>
                  <p>{selectedProduct.review_summary}</p>
                </div>
              )}

              {/* Full Review Content */}
              {selectedProduct.review_content && (
                <div className="mb-3">
                  <h6 className="text-primary">Detailed Review</h6>
                  <p style={{ whiteSpace: 'pre-line' }}>{selectedProduct.review_content}</p>
                </div>
              )}

              {/* Pros and Cons */}
              <div className="row">
                {selectedProduct.pros_list && selectedProduct.pros_list.length > 0 && (
                  <div className="col-md-6">
                    <h6 className="text-success">✓ Pros</h6>
                    <ul className="text-success">
                      {selectedProduct.pros_list.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProduct.cons_list && selectedProduct.cons_list.length > 0 && (
                  <div className="col-md-6">
                    <h6 className="text-danger">✗ Cons</h6>
                    <ul className="text-danger">
                      {selectedProduct.cons_list.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            href={`${API_BASE_URL}/api/track-product-click/${selectedProduct?.id}/`}
            target="_blank"
          >
            View on Amazon
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Google AdSense - Above Footer */}
      <Container className="my-4">
        <AdSenseAd />
      </Container>

    </div>
  );
};

// Main App Component with Routing
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>

        {/* Simple Footer with Links */}
        <footer className="bg-dark text-white mt-5">
          <Container className="py-4">
            <Row>
              <Col md={8}>
                <p className="mb-2" style={{ fontSize: '0.9rem' }}>
                  &copy; 2025 <strong>PickMeTrend</strong>. All Rights Reserved.
                </p>
                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                  <strong>Disclaimer:</strong> PickMeTrend is a participant in the Amazon Services LLC Associates Program,
                  an affiliate advertising program designed to provide a means for sites to earn advertising fees by
                  advertising and linking to Amazon.com.
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <div className="mb-3">
                  <Link to="/about" className="text-warning text-decoration-none me-3">
                    About Us
                  </Link>
                  <Link to="/privacy" className="text-warning text-decoration-none">
                    Privacy Policy
                  </Link>
                </div>

              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
