import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import hotelService from '../services/hotelService';
import bookingService from '../services/bookingService';
import { Building2, MapPin, Users, BedDouble, ArrowLeft, ShieldCheck, Check, Sparkles, Lock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { getRoomById } from '../data/hotelsData';

const DEFAULT_ROOM_DATA = getRoomById('room-101');

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Parse initial query params from HotelDetails if provided
  const searchParams = new URLSearchParams(location.search);
  const initialCheckIn = searchParams.get('checkIn');
  const initialCheckOut = searchParams.get('checkOut');
  const initialGuests = Number(searchParams.get('guests')) || 2;

  const [room, setRoom] = useState(() => getRoomById(roomId));
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await hotelService.getRoomById(roomId);
        if (res && res.data) {
          setRoom(res.data.room || res.data);
        } else {
          setRoom(getRoomById(roomId));
        }
      } catch (err) {
        setRoom(getRoomById(roomId));
      } finally {
        setLoading(false);
      }
    };

    if (roomId && roomId !== 'preview') {
      fetchRoom();
    }
  }, [roomId]);

  const handleBookingSubmit = async (formData) => {
    if (!user) {
      navigate('/login', { state: { from: `/book/${roomId}${location.search}` } });
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await bookingService.createBooking(formData);
      if (res && res.success && res.data) {
        navigate(`/booking-success/${res.data.booking?._id || res.data._id || 'confirmed'}`);
      } else {
        navigate('/booking-success/demo-ref-847291');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('This room has just been reserved for the selected dates. Please choose different dates or select another suite.');
      } else {
        setError(err.response?.data?.message || 'Unable to confirm booking. Please review your details and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Preparing your reservation…" />;

  const hotel = room.hotelId || {};

  return (
    <main id="main-content" className="booking-page">
      <div className="container container-narrow">
        <Link 
          to={hotel._id ? `/hotels/${hotel._id}` : '/hotels'} 
          className="booking-back-link"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to {hotel.name || 'Property'}</span>
        </Link>

        {/* Page Heading & Stepper */}
        <div className="booking-header">
          <div className="booking-stepper">
            <span className="step-badge active">1. Confirm Details</span>
            <span className="step-arrow">&rarr;</span>
            <span className="step-badge">2. Arrival Guarantee</span>
          </div>
          <h1 className="booking-main-title">
            Confirm and pay
          </h1>
          <p className="booking-subtitle">
            Review your itinerary, dates, and pricing before securing your room.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* 2-Column Split: Form Left (~58%), Room Snapshot Right (~42%) */}
        <div className="booking-grid-layout">
          {/* Left Column: Form & Policies */}
          <div className="booking-form-column">
            <BookingForm
              room={room}
              initialCheckIn={initialCheckIn}
              initialCheckOut={initialCheckOut}
              initialGuests={initialGuests}
              onSubmit={handleBookingSubmit}
              isSubmitting={submitting}
            />

            {/* Cancellation and Hospitality Policy */}
            <div className="booking-policy-card">
              <h3 className="policy-card-title">
                <ShieldCheck size={18} color="var(--color-primary)" /> StayEase Ground Rules & Cancellation
              </h3>
              <ul className="policy-list">
                <li>Free cancellation for 48 hours after booking.</li>
                <li>Check-in is from 2:00 PM, and check-out is by 11:00 AM.</li>
                <li>Follow the property house rules: respect quiet hours and non-smoking interiors.</li>
                <li>Verified government photo ID required at the reception desk during arrival.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Room & Hotel Snapshot Card */}
          <aside className="booking-summary-column">
            <div className="booking-summary-card">
              <div className="summary-media-row">
                <img
                  src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                  alt={`${room.roomType} preview`}
                  width="130"
                  height="100"
                  className="summary-room-img"
                  loading="lazy"
                />
                <div className="summary-room-meta">
                  <span className="summary-type-pill">{room.roomType}</span>
                  <h3 className="summary-hotel-name">{hotel.name || 'StayEase Hotel'}</h3>
                  <div className="summary-location">
                    <MapPin size={13} color="var(--color-primary)" />
                    <span>{hotel.location || hotel.city || 'India'}</span>
                  </div>
                  <div className="summary-room-specs">
                    <span>Room #{room.roomNumber}</span>
                    <span>&bull;</span>
                    <span>Up to {room.capacity}&nbsp;Guests</span>
                  </div>
                </div>
              </div>

              <div className="summary-divider"></div>

              {/* Protection & Trust Guarantee */}
              <div className="summary-protection-box">
                <div className="protection-header">
                  <Sparkles size={16} color="var(--color-primary)" />
                  <strong>StayEase Travel Protection</strong>
                </div>
                <p className="protection-text">
                  Your reservation includes comprehensive booking protection against host cancellations and property discrepancies.
                </p>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-ssl-badge">
                <Lock size={14} color="var(--color-primary)" />
                <span>256-bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BookRoom;
