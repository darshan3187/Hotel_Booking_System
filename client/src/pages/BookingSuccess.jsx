import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight, Compass, ShieldCheck, Copy, Check } from 'lucide-react';

const BookingSuccess = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const refCode = String(id || 'SE-CONFIRMED').slice(-8).toUpperCase();

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main id="main-content" className="booking-success-page">
      <div className="container container-narrow" style={{ maxWidth: '640px' }}>
        <div className="booking-success-card">
          {/* Success Checkmark Orb */}
          <div className="success-icon-orb">
            <CheckCircle2 size={44} strokeWidth={2.2} />
          </div>

          <span className="section-eyebrow" style={{ color: 'var(--color-primary)' }}>Reservation Confirmed</span>
          <h1 className="success-title">
            Your Stay is Secured
          </h1>
          <p className="success-message">
            Thank you for booking with StayEase. Your host has received your reservation details and will prepare your suite with curated hospitality.
          </p>

          {/* Reference Code Box */}
          <div className="success-ref-box">
            <div className="ref-info">
              <span className="ref-label">StayEase Confirmation Number</span>
              <strong className="ref-code tabular-nums">#{refCode}</strong>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-outline btn-sm ref-copy-btn"
              aria-label="Copy booking reference number"
            >
              {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Assurance bullet points */}
          <div className="success-perks">
            <div className="perk-item">
              <ShieldCheck size={18} color="var(--color-primary)" />
              <span>Full StayEase Protection & guaranteed room availability</span>
            </div>
            <div className="perk-item">
              <Calendar size={18} color="var(--color-primary)" />
              <span>Free cancellation up to 48 hours prior to check-in</span>
            </div>
          </div>

          {/* Actions */}
          <div className="success-actions-row">
            <Link to="/bookings" className="btn btn-primary btn-lg">
              <span>View In My Reservations</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/hotels" className="btn btn-secondary btn-lg">
              <span>Discover More Destinations</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingSuccess;
