// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/featured');
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };
    fetchFeaturedProducts();

    const sections = document.querySelectorAll('.animated-section');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-bg" />
        <div className="content">
          <h1>Authentic Handcrafted Treasures</h1>
          <p>Discover unique, artisan-made goods and support creators worldwide.</p>
          <Link to="/ceramics" className="btn">
            Explore Collections
          </Link>
        </div>
      </section>

      <section className="categories">
        <div className="categories-container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            <div className="category-card">
              <Link to="/ceramics" className="card-link" aria-label="Explore Ceramics"></Link>
              <div className="category-image">
                <img
                  src="https://th.bing.com/th/id/OIP.Juzl2Dx-Et_r8HRD-oGNdQHaIv?w=167&h=197&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3"
                  alt="Handmade ceramic pots"
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300/e9e5d8/8b5e34?text=Ceramics+Image+Not+Found')}
                />
                <Link to="/wishlist" className="wishlist-btn-link" aria-label="Add Ceramics to Wishlist">
                  <button className="wishlist-btn">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="category-content">
                <h3>Ceramics</h3>
                <p>Artisan Pottery & Decor</p>
              </div>
            </div>

            <div className="category-card">
              <Link to="/textile" className="card-link" aria-label="Explore Textiles"></Link> {/* Fixed path */}
              <div className="category-image">
                <img
                  src="https://th.bing.com/th/id/OIP.LDre8BsLzN7irEvVVUFiigHaE8?w=301&h=201&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3"
                  alt="Colorful woven textiles"
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300/e9e5d8/8b5e34?text=Textiles+Image+Not+Found')}
                />
                <Link to="/wishlist" className="wishlist-btn-link" aria-label="Add Textiles to Wishlist">
                  <button className="wishlist-btn">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="category-content">
                <h3>Textiles</h3>
                <p>Woven Goods & Fabrics</p>
              </div>
            </div>

            <div className="category-card">
              <Link to="/woodwork" className="card-link" aria-label="Explore Woodwork"></Link>
              <div className="category-image">
                <img
                  src="https://th.bing.com/th/id/OIP.PYpE_Ye6WCkj2TdI0TpsOAHaHa?cb=iwp2&pid=ImgDet&w=184&h=184&c=7&dpr=1.3"
                  alt=""
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300/e9e5d8/8b5e34?text=Woodwork+Image+Not+Found')}
                />
                <Link to="/wishlist" className="wishlist-btn-link" aria-label="Add Woodwork to Wishlist">
                  <button className="wishlist-btn">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="category-content">
                <h3>Woodwork</h3>
                <p>Handcrafted Wooden Items</p>
              </div>
            </div>

            <div className="category-card">
              <Link to="/jewellery" className="card-link" aria-label="Explore Jewelry"></Link>
              <div className="category-image">
                <img
                  src="https://www.dunejewelry.com/blog/wp-content/uploads/2017/08/dune-jewelry-teardrop-earrings-DSC_0873.jpg"
                  alt="Silver necklace with pendant"
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300/e9e5d8/8b5e34?text=Jewelry+Image+Not+Found')}
                />
                <Link to="/wishlist" className="wishlist-btn-link" aria-label="Add Jewelry to Wishlist">
                  <button className="wishlist-btn">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              <div className="category-content">
                <h3>Jewelry</h3>
                <p>Unique Artisan Pieces</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us animated-section" id="about-us">
        <div className="about-container">
          <h2>About Us</h2>
          <p className="about-intro">
            CraftMarket is more than just a marketplace; it's a celebration of global artistry and
            authentic craftsmanship. We connect discerning customers with talented artisans, fostering a
            community built on quality, ethical practices, and a shared passion for unique, handcrafted goods.
          </p>
          <div className="about-values">
            <div className="value-card">
              <div className="value-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="12 8 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Curated Quality</h3>
              <p>Every piece is carefully handpicked and vetted, ensuring exceptional craftsmanship and lasting value.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Ethical Partnerships</h3>
              <p>We champion fair trade and sustainable practices, empowering artisans and preserving traditional skills.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Community Focus</h3>
              <p>Our platform connects diverse cultures, celebrates global craft, and builds meaningful relationships.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="placeholder-section animated-section" id="artisan-spotlight">
        <h2>Artisan Spotlight</h2>
        <p>Meet the makers behind the magic. Discover their stories and inspiration.</p>
        <div className="spotlight-container">
          <div className="spotlight-image">
            <img
              src="https://th.bing.com/th/id/OIP.pUYDyqBD0wkziDTpoirluwHaE8?w=258&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7"
              alt="Artisan Isabelle Dubois weaving"
              loading="lazy"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/450/e9e5d8/8b5e34?text=Artisan+Image+Not+Found')}
            />
          </div>
          <div className="spotlight-content">
            <h3>Isabelle Dubois - Weaver</h3>
            <p>
              From her sunlit studio in Provence, Isabelle Dubois transforms natural fibers into breathtaking
              tapestries and scarves. Inspired by the surrounding lavender fields and olive groves, her work blends
              traditional techniques with contemporary color palettes. Each thread tells a story of patience,
              passion, and the beauty of the natural world.
            </p>
            <Link to="/seller/isabelle-dubois" className="btn btn-small">
              Visit Isabelle's Shop
            </Link>
          </div>
        </div>
      </section>

      <section className="testimonials animated-section" id="testimonials">
        <div className="testimonials-container">
          <h2>Voices from Our Community</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">“</div>
              <p className="testimonial-text">
                Selling through CraftMarket has been a game-changer. I reach customers worldwide who appreciate the
                story behind my ceramics. The support from the CraftMarket team is fantastic!
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/42.jpg"
                    alt="Emma Rodriguez"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/60/e9e5d8/8b5e34?text=Avatar+Not+Found')}
                  />
                </div>
                <div className="author-info">
                  <h4>Emma R.</h4>
                  <p>Ceramic Artist</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">“</div>
              <p className="testimonial-text">
                I love finding unique, ethically sourced gifts here. Knowing I'm supporting real artisans makes each
                purchase special. The quality is always outstanding.
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="James Chen"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/60/e9e5d8/8b5e34?text=Avatar+Not+Found')}
                  />
                </div>
                <div className="author-info">
                  <h4>James C.</h4>
                  <p>Happy Customer</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">“</div>
              <p className="testimonial-text">
                Beautiful selection and wonderful customer service. Had a small issue with shipping (not their fault!),
                and they resolved it quickly and kindly. Highly recommend!
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/65.jpg"
                    alt="Priya Sharma"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/60/e9e5d8/8b5e34?text=Avatar+Not+Found')}
                  />
                </div>
                <div className="author-info">
                  <h4>Priya S.</h4>
                  <p>Home Decor Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;