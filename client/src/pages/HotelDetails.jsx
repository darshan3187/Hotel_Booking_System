import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Star, 
  Share2, 
  Heart, 
  Award, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Waves, 
  Wind, 
  Clock, 
  ChevronRight,
  Grid,
  CheckCircle2
} from 'lucide-react';
import hotelService from '../services/hotelService';
import { formatCurrency, formatDateForInput, calculateNights } from '../utils/formatters';
import { getHotelById } from '../data/hotelsData';

const DEFAULT_HOTEL_DETAIL = getHotelById('1');
const DEFAULT_ROOMS = DEFAULT_HOTEL_DETAIL.rooms;

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(() => getHotelById(id));
  const [rooms, setRooms] = useState(() => getHotelById(id).rooms || DEFAULT_ROOMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Reservation Interactive Date State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkIn, setCheckIn] = useState(formatDateForInput(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDateForInput(dayAfter));
  const [guests, setGuests] = useState(2);

  const nights = Math.max(1, calculateNights(checkIn, checkOut));
  const selectedRoom = rooms[0] || DEFAULT_ROOMS[0];
  const nightlyRate = selectedRoom.pricePerNight || 5800;
  const subtotal = nightlyRate * nights;

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const res = await hotelService.getHotelById(id);
        if (res && res.data) {
          const loaded = res.data.hotel || res.data;
          setHotel(loaded);
          if (res.data.rooms && res.data.rooms.length > 0) {
            setRooms(res.data.rooms);
          }
        } else {
          const localHotel = getHotelById(id);
          setHotel(localHotel);
          if (localHotel.rooms) setRooms(localHotel.rooms);
        }
      } catch (err) {
        const localHotel = getHotelById(id);
        setHotel(localHotel);
        if (localHotel.rooms) setRooms(localHotel.rooms);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotel();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading) return <Loader message="Curating property details…" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main id="main-content" className="hotel-details-page">
      {/* Share Toast */}
      {shareToast && (
        <aside className="toast-notification" role="status" aria-live="polite">
          <CheckCircle2 size={16} color="var(--color-success)" />
          <span>Property link copied to clipboard</span>
        </aside>
      )}

      <div className="container container-wide">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="details-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to="/hotels">Hotels</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to={`/hotels?city=${hotel.city}`}>{hotel.city}</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{hotel.name}</span>
        </nav>

        {/* Title & Actions Row */}
        <header className="details-header-row">
          <div>
            <div className="details-city-tag">
              <MapPin size={14} aria-hidden="true" />
              <span>{hotel.location || hotel.city}</span>
            </div>
            <h1 className="details-title">{hotel.name}</h1>
            <div className="details-meta-line">
              <span className="details-rating-badge tabular-nums">
                <Star size={14} fill="currentColor" color="currentColor" />
                {hotel.rating || 4.92}
              </span>
              <span className="details-dot">&bull;</span>
              <a href="#reviews" className="details-reviews-link">
                {hotel.reviewsCount || 148}&nbsp;verified reviews
              </a>
              <span className="details-dot">&bull;</span>
              <span className="details-badge-verified">
                <ShieldCheck size={14} color="var(--color-primary)" /> StayEase Certified
              </span>
            </div>
          </div>

          <div className="details-action-group">
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-outline btn-sm details-icon-btn"
              aria-label="Share property link"
            >
              <Share2 size={15} aria-hidden="true" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={handleToggleSave}
              className={`btn btn-outline btn-sm details-icon-btn ${isSaved ? 'saved' : ''}`}
              aria-label={isSaved ? "Remove property from wishlist" : "Save property to wishlist"}
              aria-pressed={isSaved}
            >
              <Heart 
                size={15} 
                fill={isSaved ? "var(--color-primary)" : "none"} 
                color={isSaved ? "var(--color-primary)" : "currentColor"} 
                aria-hidden="true" 
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </header>

        {/* 5-Photo Editorial Gallery Grid */}
        <section className="details-photo-grid" aria-label="Property gallery">
          <div className="photo-grid-cell photo-cell-hero">
            <img
              src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
              alt={`${hotel.name} primary architecture`}
              width="800"
              height="450"
              fetchPriority="high"
            />
          </div>
          <div className="photo-grid-cell">
            <img
              src={hotel.images?.[1] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'}
              alt={`${hotel.name} reception and salon`}
              width="400"
              height="220"
              loading="lazy"
            />
          </div>
          <div className="photo-grid-cell">
            <img
              src={hotel.images?.[2] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'}
              alt={`${hotel.name} private courtyard garden`}
              width="400"
              height="220"
              loading="lazy"
            />
          </div>
          <div className="photo-grid-cell">
            <img
              src={hotel.images?.[3] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
              alt={`${hotel.name} deluxe suite`}
              width="400"
              height="220"
              loading="lazy"
            />
          </div>
          <div className="photo-grid-cell photo-cell-last">
            <img
              src={hotel.images?.[4] || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80'}
              alt={`${hotel.name} architectural terrace`}
              width="400"
              height="220"
              loading="lazy"
            />
            <button 
              type="button" 
              className="photo-grid-view-all" 
              onClick={() => {}}
              aria-label="View all property photos"
            >
              <Grid size={15} aria-hidden="true" />
              <span>Show all 18 photos</span>
            </button>
          </div>
        </section>

        {/* 2-Column Main Layout: Details Left (~62%), Sticky Reservation Rail Right (~38%) */}
        <div className="details-layout-columns">
          {/* Left Column Content */}
          <div className="details-main-column">
            {/* StayEase Guest Favorite Banner */}
            <div className="guest-favorite-banner">
              <div className="guest-favorite-text">
                <span className="guest-favorite-pill">
                  <Award size={14} aria-hidden="true" /> Guest Favorite
                </span>
                <p className="guest-favorite-desc">
                  Ranked in the top 5% of boutique properties across India based on guest satisfaction and host responsiveness.
                </p>
              </div>
              <div className="guest-favorite-rating-block">
                <span className="rating-huge tabular-nums">{hotel.rating || 4.92}</span>
                <div className="star-row" aria-label={`Rating ${hotel.rating || 4.92} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--color-primary)" color="var(--color-primary)" />
                  ))}
                </div>
              </div>
            </div>

            {/* Host Hospitality Assurance */}
            <div className="details-host-card">
              <div className="host-avatar">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Host avatar"
                  width="54"
                  height="54"
                  loading="lazy"
                />
                <span className="host-super-badge" title="Superhost">★</span>
              </div>
              <div className="host-info">
                <h3 className="host-name">Hosted by StayEase Heritage Curators</h3>
                <p className="host-meta">Superhost &bull; 8 years hosting on StayEase &bull; 100% Response Rate</p>
              </div>
            </div>

            {/* Editorial Description */}
            <section className="details-section" aria-labelledby="about-space-heading">
              <h2 id="about-space-heading" className="details-section-heading">
                About this space
              </h2>
              <p className="details-body-text">
                {hotel.description}
              </p>
            </section>

            {/* What this place offers (Amenities) */}
            <section className="details-section" aria-labelledby="amenities-heading">
              <h2 id="amenities-heading" className="details-section-heading">
                What this place offers
              </h2>
              <div className="amenities-grid">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="amenity-item">
                    <Check size={18} color="var(--color-primary)" aria-hidden="true" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Select Room Configuration (Room Cards) */}
            <section className="details-section" aria-labelledby="rooms-heading">
              <div className="section-header-flex">
                <div>
                  <h2 id="rooms-heading" className="details-section-heading">
                    Available Suites & Rooms
                  </h2>
                  <p className="section-subtext">All suites include artisanal breakfast and complimentary Wi-Fi.</p>
                </div>
                <span className="room-count-pill">{rooms.length}&nbsp;Suites</span>
              </div>

              <div className="rooms-stack">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} hotelId={hotel._id} />
                ))}
              </div>
            </section>

            {/* Reviews Highlight & Score Breakdown */}
            <section id="reviews" className="details-section" aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className="details-section-heading">
                ★ {hotel.rating || 4.92} &bull; {hotel.reviewsCount || 148} Verified Reviews
              </h2>

              <div className="reviews-score-breakdown">
                <div className="score-metric">
                  <span className="metric-label">Cleanliness</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '98%' }}></div>
                  </div>
                  <span className="metric-val tabular-nums">4.9</span>
                </div>
                <div className="score-metric">
                  <span className="metric-label">Accuracy</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '98%' }}></div>
                  </div>
                  <span className="metric-val tabular-nums">4.9</span>
                </div>
                <div className="score-metric">
                  <span className="metric-label">Check-in</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                  <span className="metric-val tabular-nums">5.0</span>
                </div>
                <div className="score-metric">
                  <span className="metric-label">Communication</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '98%' }}></div>
                  </div>
                  <span className="metric-val tabular-nums">4.9</span>
                </div>
                <div className="score-metric">
                  <span className="metric-label">Location</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '96%' }}></div>
                  </div>
                  <span className="metric-val tabular-nums">4.8</span>
                </div>
                <div className="score-metric">
                  <span className="metric-label">Value</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '96%' }}></div>
                  </div>
                  <span className="metric-val tabular-nums">4.8</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Rail: Interactive Reservation Card */}
          <aside className="details-sidebar-rail" aria-label="Reservation sidebar">
            <div className="reservation-card-elevated">
              {/* Price header */}
              <div className="reservation-header">
                <div>
                  <span className="reservation-price tabular-nums">{formatCurrency(nightlyRate)}</span>
                  <span className="reservation-unit">&nbsp;/ night</span>
                </div>
                <div className="reservation-rating tabular-nums">
                  <Star size={14} fill="var(--color-primary)" color="var(--color-primary)" />
                  <strong>{hotel.rating || 4.92}</strong>
                  <span className="reservation-reviews-count">({hotel.reviewsCount || 148})</span>
                </div>
              </div>

              {/* Interactive Date & Guest Picker Box */}
              <div className="reservation-picker-box">
                <div className="picker-dates-row">
                  <div className="picker-input-cell">
                    <label htmlFor="res-checkin" className="picker-label">Check-in</label>
                    <input
                      id="res-checkin"
                      type="date"
                      className="picker-input"
                      value={checkIn}
                      min={formatDateForInput(new Date())}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && e.target.value >= checkOut) {
                          const next = new Date(e.target.value);
                          next.setDate(next.getDate() + 1);
                          setCheckOut(formatDateForInput(next));
                        }
                      }}
                    />
                  </div>
                  <div className="picker-input-cell">
                    <label htmlFor="res-checkout" className="picker-label">Check-out</label>
                    <input
                      id="res-checkout"
                      type="date"
                      className="picker-input"
                      value={checkOut}
                      min={checkIn || formatDateForInput(new Date())}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className="picker-guests-row">
                  <label htmlFor="res-guests" className="picker-label">Guests</label>
                  <select
                    id="res-guests"
                    className="picker-select"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              {/* Main Reserve CTA */}
              <Link
                to={`/book/${selectedRoom._id || 'room-101'}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                className="btn btn-primary btn-reserve"
              >
                Reserve Selected Suite
              </Link>

              <p className="reservation-disclaimer">
                You won’t be charged yet &bull; Instant confirmation
              </p>

              {/* Price Calculation Breakdown */}
              <div className="price-breakdown-list">
                <div className="breakdown-row">
                  <span className="breakdown-label">{formatCurrency(nightlyRate)} &times; {nights}&nbsp;{nights === 1 ? 'night' : 'nights'}</span>
                  <span className="breakdown-value tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-label">StayEase concierge service fee</span>
                  <span className="breakdown-value free">FREE</span>
                </div>
                <div className="breakdown-total-row">
                  <span className="total-label">Total before taxes</span>
                  <span className="total-value tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Trust & Guarantee Notes */}
              <div className="reservation-trust-box">
                <div className="trust-item">
                  <ShieldCheck size={16} color="var(--color-primary)" aria-hidden="true" />
                  <span>Free cancellation up to 48h before check-in</span>
                </div>
                <div className="trust-item">
                  <Sparkles size={16} color="var(--color-primary)" aria-hidden="true" />
                  <span>Best rate guarantee with StayEase Shield</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default HotelDetails;
