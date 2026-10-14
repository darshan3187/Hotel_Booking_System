import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight, 
  Compass, 
  CheckCircle2,
  Building2,
  MapPin
} from 'lucide-react';
import '../styles/about.css';

const About = () => {
  return (
    <main id="main-content" className="about-page">
      {/* ====================================================================
          1. HERO SECTION — About StayEase
          ==================================================================== */}
      <section className="about-hero-section" aria-labelledby="hero-title">
        <div className="container">
          <div className="about-hero-grid">
            {/* Left Column: Editorial Narrative */}
            <div className="about-hero-text">
              <span className="about-eyebrow">OUR STORY</span>
              <h1 id="hero-title" className="about-hero-title">
                Every Stay Has a Story.
              </h1>
              <p className="about-hero-lead">
                StayEase connects travelers with carefully selected boutique hotels,
                unique properties, and authentic local experiences across India.
              </p>
              <p className="about-hero-body">
                We believe that travel is shaped by where you choose to rest. From
                centuries-old restored havelis in Gujarat and Rajasthan to peaceful
                coastal manors in Goa and tranquil backwater sanctuaries in Kerala,
                our platform brings together character-rich accommodations curated
                for travelers who appreciate architectural heritage and considerate
                hospitality.
              </p>
              <div className="about-hero-signature">
                <Compass size={22} color="#D45B35" aria-hidden="true" />
                <p className="about-hero-signature-text">
                  “Connecting thoughtful travelers with the character and heritage of India.”
                </p>
              </div>
            </div>

            {/* Right Column: Editorial Photography Composition */}
            <div className="about-hero-imagery">
              <figure className="about-hero-main-frame">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                  alt="Historic Indian luxury heritage hotel featuring classical ivory archways, peaceful courtyard pool, and sunlit colonnade"
                  className="about-hero-main-img"
                  loading="eager"
                />
              </figure>

              {/* Overlapping Inset Card */}
              <aside 
                className="about-hero-floating-card"
                aria-label="Highlighted boutique stay detail"
              >
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80"
                  alt="Bespoke teak canopy bed and brass lamps inside a heritage suite"
                  className="about-hero-floating-thumb"
                  loading="lazy"
                />
                <div className="about-hero-floating-content">
                  <span className="about-hero-floating-tag">Curated Stays</span>
                  <span className="about-hero-floating-title">
                    Handcrafted Heritage &amp; Boutique Suites
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. OUR PHILOSOPHY / WHY STAYEASE
          ==================================================================== */}
      <section className="about-philosophy-section" aria-labelledby="philosophy-title">
        <div className="container">
          <div className="about-philosophy-card">
            <header className="about-section-header">
              <span className="about-eyebrow">OUR PHILOSOPHY</span>
              <h2 id="philosophy-title" className="about-section-title">
                Hospitality Grounded in Authenticity &amp; Care
              </h2>
              <p className="about-section-desc">
                Three foundational commitments guide how we curate properties,
                structure reservations, and support every guest journey.
              </p>
            </header>

            <div className="about-philosophy-grid">
              {/* Principle 01 */}
              <article className="about-philosophy-item">
                <div className="about-philosophy-header-row">
                  <div className="about-philosophy-icon-wrap" aria-hidden="true">
                    <Sparkles size={22} />
                  </div>
                  <span className="about-philosophy-num" aria-hidden="true">01</span>
                </div>
                <h3 className="about-philosophy-name">Curated Stays</h3>
                <p className="about-philosophy-text">
                  Every property is selected for its quality, comfort, character,
                  and hospitality.
                </p>
              </article>

              {/* Principle 02 */}
              <article className="about-philosophy-item">
                <div className="about-philosophy-header-row">
                  <div className="about-philosophy-icon-wrap" aria-hidden="true">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="about-philosophy-num" aria-hidden="true">02</span>
                </div>
                <h3 className="about-philosophy-name">Booking With Confidence</h3>
                <p className="about-philosophy-text">
                  Provide a clear and reliable booking experience with transparent
                  pricing, booking details, and cancellation information.
                </p>
              </article>

              {/* Principle 03 */}
              <article className="about-philosophy-item">
                <div className="about-philosophy-header-row">
                  <div className="about-philosophy-icon-wrap" aria-hidden="true">
                    <HeartHandshake size={22} />
                  </div>
                  <span className="about-philosophy-num" aria-hidden="true">03</span>
                </div>
                <h3 className="about-philosophy-name">Hospitality That Cares</h3>
                <p className="about-philosophy-text">
                  Help travelers find suitable stays and access support when they
                  need assistance.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. BRAND STORY SECTION (Asymmetrical Editorial Storytelling)
          ==================================================================== */}
      <section className="about-story-section" aria-labelledby="story-title">
        <div className="container">
          <div className="about-story-grid">
            {/* Left: Atmospheric Photography with Terracotta Framing */}
            <div className="about-story-image-wrap">
              <div className="about-story-accent-frame" aria-hidden="true" />
              <figure className="about-story-image-frame">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                  alt="Restored Indo-Saracenic mansion courtyard with ornate stone jali carvings and shaded verandah in Ahmedabad"
                  className="about-story-image"
                  loading="lazy"
                />
              </figure>
              <div className="about-story-caption">
                <span className="about-story-caption-dot" aria-hidden="true" />
                <span>The House of Mangaldas Girdhardas — Ahmedabad, Gujarat</span>
              </div>
            </div>

            {/* Right: Narrative Story */}
            <div className="about-story-content">
              <span className="about-eyebrow">THE PURPOSE</span>
              <h2 id="story-title" className="about-story-title">
                Travel Better. Stay Somewhere Special.
              </h2>
              <p className="about-story-narrative">
                Travel should never feel impersonal or purely transactional. India's
                hospitality traditions are rooted in authentic warmth, regional
                craftsmanship, and extraordinary architectural diversity—from
                centuries-old sandstone citadels in Rajasthan to leafy garden
                villas in Bengaluru and riverside retreats in Varanasi.
              </p>
              <p className="about-story-narrative">
                StayEase was created to make it easier for travelers to discover
                accommodations that genuinely match their travel style, whether they
                seek a tranquil boutique hotel in the historic quarter, a peaceful
                hillside retreat, or a distinctive base for exploring memorable
                destinations.
              </p>
              <blockquote className="about-story-quote">
                <p className="about-story-quote-text">
                  “Where heritage architecture meets the serenity of thoughtful hospitality.”
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. STAYEASE STATISTICS (Deep Navy & High-Contrast Ivory)
          ==================================================================== */}
      <section className="about-stats-section" aria-labelledby="stats-title">
        <div className="container">
          <div className="about-stats-container">
            <header className="about-stats-header">
              <span className="about-stats-eyebrow">PLATFORM REACH</span>
              <h2 id="stats-title" className="about-stats-title">
                StayEase by the Numbers
              </h2>
              <p className="about-stats-subtitle">
                Factual platform metrics reflecting our curated catalog and
                booking capabilities across India.
              </p>
            </header>

            <div className="about-stats-grid">
              {/* Stat 01 */}
              <div className="about-stat-item">
                <div className="about-stat-value">60</div>
                <div className="about-stat-label">Curated Properties</div>
                <div className="about-stat-detail">
                  Boutique hotels &amp; heritage havelis handpicked across India
                </div>
              </div>

              {/* Stat 02 */}
              <div className="about-stat-item">
                <div className="about-stat-value">12</div>
                <div className="about-stat-label">Destinations Across India</div>
                <div className="about-stat-detail">
                  Covering Ahmedabad, Jaipur, Mumbai, Goa, Udaipur, and beyond
                </div>
              </div>

              {/* Stat 03 */}
              <div className="about-stat-item">
                <div className="about-stat-value">4</div>
                <div className="about-stat-label">Tailored Room Classes</div>
                <div className="about-stat-detail">
                  Standard, Deluxe, Heritage Suites &amp; Family Residences
                </div>
              </div>

              {/* Stat 04 */}
              <div className="about-stat-item">
                <div className="about-stat-value">100%</div>
                <div className="about-stat-label">Transparent Pricing</div>
                <div className="about-stat-detail">
                  Clear nightly rates, itemized GST &amp; zero hidden booking fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. CALL TO ACTION (CTA)
          ==================================================================== */}
      <section className="about-cta-section" aria-labelledby="cta-title">
        <div className="container">
          <div className="about-cta-card">
            <span className="about-cta-eyebrow">BEGIN YOUR JOURNEY</span>
            <h2 id="cta-title" className="about-cta-title">
              Your Next Great Stay Starts Here.
            </h2>
            <p className="about-cta-desc">
              Explore distinctive stays and find the right place for your next journey.
            </p>
            <div className="about-cta-actions">
              <Link 
                to="/hotels" 
                className="about-cta-primary-btn"
                id="about-cta-explore-btn"
              >
                <span>Explore Stays</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link 
                to="/contact" 
                className="about-cta-secondary-link"
                id="about-cta-support-link"
              >
                <span>Need Assistance? Contact Concierge</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
