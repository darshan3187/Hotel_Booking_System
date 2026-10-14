import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Building2, CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate, calculateNights } from '../utils/formatters';

const BookingCard = ({ booking, onCancel }) => {
  if (!booking) return null;

  const {
    _id,
    id,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests = 1,
    totalAmount = 0,
    status = 'confirmed',
    createdAt
  } = booking;

  const bookingId = _id || id;
  const hotelName = hotelId?.name || 'Grand StayEase Luxury Hotel';
  const hotelLocation = hotelId?.location || hotelId?.city || 'India';
  const roomType = roomId?.roomType || 'Deluxe Heritage Suite';
  const nights = Math.max(1, calculateNights(checkIn, checkOut));

  const getStatusBadge = (st) => {
    switch (st) {
      case 'confirmed':
        return (
          <span className="badge badge-confirmed">
            <CheckCircle2 size={13} aria-hidden="true" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="badge badge-pending">
            <Clock size={13} aria-hidden="true" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-cancelled">
            <XCircle size={13} aria-hidden="true" /> Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="badge badge-completed">
            <CheckCircle2 size={13} aria-hidden="true" /> Completed
          </span>
        );
      default:
        return <span className="badge badge-neutral">{st}</span>;
    }
  };

  const canCancel = status === 'confirmed' || status === 'pending';

  return (
    <article className="itinerary-card" aria-labelledby={`booking-title-${bookingId}`}>
      {/* Top Meta Bar */}
      <div className="itinerary-top-bar">
        <div>
          <span className="itinerary-ref">
            Booking Ref #{String(bookingId).slice(-6).toUpperCase()}
          </span>
          <h3 id={`booking-title-${bookingId}`} className="itinerary-hotel-title">
            {hotelName}
          </h3>
          <div className="itinerary-location-meta">
            <MapPin size={13} color="var(--color-primary)" aria-hidden="true" />
            <span>{hotelLocation}</span>
            <span className="itinerary-dot">&bull;</span>
            <span className="itinerary-room-name">{roomType}</span>
          </div>
        </div>

        <div className="itinerary-status-wrap">
          {getStatusBadge(status)}
        </div>
      </div>

      {/* Grid of Key Reservation Details */}
      <div className="itinerary-details-grid">
        <div className="itinerary-detail-item">
          <span className="detail-label">Dates of Stay</span>
          <div className="detail-value-row">
            <Calendar size={14} color="var(--color-primary)" aria-hidden="true" />
            <span className="tabular-nums">{formatDate(checkIn)} &rarr; {formatDate(checkOut)}</span>
          </div>
          <span className="detail-subtext">({nights}&nbsp;{nights === 1 ? 'Night' : 'Nights'})</span>
        </div>

        <div className="itinerary-detail-item">
          <span className="detail-label">Occupancy</span>
          <div className="detail-value-row">
            <Users size={14} color="var(--color-primary)" aria-hidden="true" />
            <span>{guests}&nbsp;{guests === 1 ? 'Guest' : 'Guests'}</span>
          </div>
          <span className="detail-subtext">Private Suite Access</span>
        </div>

        <div className="itinerary-detail-item">
          <span className="detail-label">Total Amount Paid</span>
          <div className="itinerary-total-amount tabular-nums">
            {formatCurrency(totalAmount)}
          </div>
          <span className="detail-subtext">Taxes & fees included</span>
        </div>

        <div className="itinerary-actions-wrap">
          {hotelId?._id && (
            <Link 
              to={`/hotels/${hotelId._id}`} 
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View Property</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          )}

          {canCancel && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(bookingId)}
              className="btn btn-outline btn-sm btn-cancel-booking"
              aria-label={`Cancel reservation for ${hotelName}`}
            >
              Cancel Reservation
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookingCard;
