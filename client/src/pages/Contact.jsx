import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import '../styles/contact.css';

const TOPICS = [
  'Reservation Help',
  'Boutique Stays & Advice',
  'Modify Booking Dates',
  'Property Partnership',
  'Feedback & Inquiries'
];

const FAQS = [
  {
    q: 'How do I arrange late check-in or airport transfers?',
    a: 'Simply share your arrival details and booking reference with our concierge. We coordinate directly with your hotel host to ensure private transfer greeting and smooth late-night arrivals.'
  },
  {
    q: 'What is the cancellation policy on boutique stays?',
    a: 'Most properties offer full cancellation up to 48 hours prior to check-in. You can review your stay terms and manage cancellations anytime from your personal Bookings dashboard.'
  },
  {
    q: 'Are taxes and fees transparently included?',
    a: 'Yes. StayEase follows strict transparent pricing. Nightly rates display itemized GST breakdowns with zero hidden resort fees or unexpected charges upon check-in.'
  },
  {
    q: 'Can I request bespoke heritage dining or private tours?',
    a: 'Certainly. Our partner havelis and luxury retreats offer curated local experiences—from traditional rooftop thali dinners in Ahmedabad to private boat rides in Varanasi.'
  }
];

const Contact = () => {
  const [selectedTopic, setSelectedTopic] = useState('Reservation Help');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bookingRef: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main id="main-content" className="contact-page">
      <div className="container">
        {/* ==================================================================
            1. Editorial Page Header
            ================================================================== */}
        <header className="contact-header">
          <span className="contact-eyebrow">GUEST CONCIERGE &amp; SUPPORT</span>
          <h1 className="contact-title">We’re Here to Assist Your Journey</h1>
          <p className="contact-subtitle">
            Whether coordinating a private heritage stay, planning special arrival arrangements, 
            or seeking personalized travel recommendations across India—our concierge is at your service.
          </p>
        </header>

        {/* ==================================================================
            2. Two-Column Layout (Concierge Desk & Modern Form)
            ================================================================== */}
        <div className="contact-layout-grid">
          {/* Left Column: Dedicated Concierge Panel */}
          <aside className="contact-concierge-card" aria-label="Concierge and Contact Details">
            <div>
              <div className="contact-concierge-header">
                <div className="contact-concierge-badge">
                  <span className="contact-concierge-pulse" aria-hidden="true" />
                  <span>Hospitality Desk Online</span>
                </div>
                <h2 className="contact-concierge-title">Dedicated Guest Support</h2>
                <p className="contact-concierge-desc">
                  Our hospitality team is based across India to assist with your boutique reservations,
                  room preferences, and on-ground logistics.
                </p>
              </div>

              <div className="contact-channels-list">
                {/* Channel 1: Phone */}
                <div className="contact-channel-item">
                  <div className="contact-channel-icon-wrap" aria-hidden="true">
                    <Phone size={20} />
                  </div>
                  <div className="contact-channel-details">
                    <span className="contact-channel-label">Concierge Helpline</span>
                    <a href="tel:+9118001234567" className="contact-channel-value">
                      +91 1800-123-4567 (Toll Free)
                    </a>
                    <a href="tel:+919876543210" className="contact-channel-value">
                      +91 98765-43210 (Direct Support)
                    </a>
                    <span className="contact-channel-meta">Daily: 7:00 AM – 11:00 PM IST</span>
                  </div>
                </div>

                {/* Channel 2: Email */}
                <div className="contact-channel-item">
                  <div className="contact-channel-icon-wrap" aria-hidden="true">
                    <Mail size={20} />
                  </div>
                  <div className="contact-channel-details">
                    <span className="contact-channel-label">Direct Correspondence</span>
                    <a href="mailto:concierge@stayease.com" className="contact-channel-value">
                      concierge@stayease.com
                    </a>
                    <a href="mailto:partnerships@stayease.com" className="contact-channel-value">
                      partnerships@stayease.com
                    </a>
                    <span className="contact-channel-meta">Replies within 2 business hours</span>
                  </div>
                </div>

                {/* Channel 3: Sanctuaries */}
                <div className="contact-channel-item">
                  <div className="contact-channel-icon-wrap" aria-hidden="true">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-channel-details">
                    <span className="contact-channel-label">Hospitality Sanctuaries</span>
                    <p className="contact-channel-value" style={{ margin: 0 }}>
                      Heritage Pavilion, Civil Lines, Jaipur 302006<br />
                      Sanctuary Suites, MG Road, Bengaluru 560001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Vignette */}
            <div className="contact-concierge-footer">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80"
                alt="Boutique palace courtyard with serene swimming pool"
                className="contact-concierge-thumb"
                loading="lazy"
              />
              <p className="contact-concierge-footer-text">
                <strong>Attentive Hospitality:</strong> Average response time is under 15 minutes
                during active guest check-in hours.
              </p>
            </div>
          </aside>

          {/* Right Column: Refined Message Form */}
          <section className="contact-form-card" aria-label="Send a Message Form">
            {submitted ? (
              <div className="contact-success-state">
                <div className="contact-success-icon-wrap">
                  <CheckCircle2 size={36} aria-hidden="true" />
                </div>
                <h3 className="contact-success-title">Message Received</h3>
                <p className="contact-success-desc">
                  Thank you, <strong>{formData.name || 'Traveler'}</strong>. Our concierge team has 
                  received your inquiry regarding <em>{selectedTopic}</em> and will respond to{' '}
                  <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  className="contact-reset-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      bookingRef: '',
                      subject: '',
                      message: ''
                    });
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="contact-form-title">Send Us a Message</h2>
                <p className="contact-form-desc">
                  Select your inquiry category and share your details below.
                </p>

                {/* Inquiry Topic Chips */}
                <div className="contact-topics-group">
                  <span className="contact-topics-label">Select Inquiry Nature:</span>
                  <div className="contact-topics-row" role="radiogroup" aria-label="Inquiry nature">
                    {TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        role="radio"
                        aria-checked={selectedTopic === topic}
                        className={`contact-topic-chip ${selectedTopic === topic ? 'active' : ''}`}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-name" className="contact-label">Your Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="contact-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="contact-email" className="contact-label">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="contact-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Phone & Booking Ref Row */}
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="contact-phone" className="contact-label">
                      Phone Number <span style={{ opacity: 0.6 }}>(Optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="contact-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="contact-ref" className="contact-label">
                      Booking Reference <span style={{ opacity: 0.6 }}>(If applicable)</span>
                    </label>
                    <input
                      id="contact-ref"
                      type="text"
                      placeholder="e.g. SE-847291"
                      className="contact-input"
                      value={formData.bookingRef}
                      onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="contact-form-group">
                  <label htmlFor="contact-subject" className="contact-label">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder={`e.g. Inquiring regarding ${selectedTopic.toLowerCase()}`}
                    className="contact-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                {/* Message */}
                <div className="contact-form-group">
                  <label htmlFor="contact-message" className="contact-label">How May We Assist You? *</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Tell us about your dates, destination, special preferences, or questions..."
                    className="contact-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Submit Action */}
                <button 
                  type="submit" 
                  className="contact-submit-btn"
                  id="contact-submit-btn"
                >
                  <Send size={18} aria-hidden="true" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}
          </section>
        </div>

        {/* ==================================================================
            3. Common Guest Questions (FAQ Section)
            ================================================================== */}
        <section className="contact-faq-section" aria-labelledby="faq-heading">
          <div className="contact-faq-header">
            <h2 id="faq-heading" className="contact-faq-title">Frequently Asked Questions</h2>
            <p className="contact-faq-desc">
              Quick answers to common questions about reservations, check-in, and stay policies.
            </p>
          </div>

          <div className="contact-faq-grid">
            {FAQS.map((faq, index) => (
              <div key={index} className="contact-faq-item">
                <h3 className="contact-faq-question">
                  <span className="contact-faq-question-dot" aria-hidden="true" />
                  <span>{faq.q}</span>
                </h3>
                <p className="contact-faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contact;
