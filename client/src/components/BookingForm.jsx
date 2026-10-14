import React, { useState } from 'react';
import { Calendar, Users, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { formatDateForInput, calculateNights, formatCurrency } from '../utils/formatters';

const BookingForm = ({ 
  room, 
  initialCheckIn, 
  initialCheckOut, 
  initialGuests = 1, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkIn, setCheckIn] = useState(initialCheckIn || formatDateForInput(tomorrow));
  const [checkOut, setCheckOut] = useState(initialCheckOut || formatDateForInput(dayAfter));
  const [guests, setGuests] = useState(initialGuests || 1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [validationError, setValidationError] = useState('');

  const nights = Math.max(1, calculateNights(checkIn, checkOut));
  const pricePerNight = room?.pricePerNight || 0;
  const estimatedTotal = nights * pricePerNight;
  const taxesAndFees = Math.round(estimatedTotal * 0.12); // 12% GST
  const grandTotal = estimatedTotal + taxesAndFees;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const todayStr = formatDateForInput(new Date());
    if (checkIn < todayStr) {
      setValidationError('Check-in date cannot be in the past.');
      return;
    }
    if (checkOut <= checkIn) {
      setValidationError('Check-out date must be strictly after the check-in date.');
      return;
    }
    if (guests < 1) {
      setValidationError('Please select at least 1 guest.');
      return;
    }
    if (room?.capacity && guests > room.capacity) {
      setValidationError(`This room accommodates a maximum of ${room.capacity} guests.`);
      return;
    }

    onSubmit({
      roomId: room._id || room.id,
      hotelId: room.hotelId?._id || room.hotelId,
      checkIn,
      checkOut,
      guests: Number(guests),
      specialRequests
    });
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form-elevated">
      {/* Rate Display Top */}
      <div className="booking-form-top">
        <div>
          <span className="booking-rate-label">Standard Nightly Rate</span>
          <div className="booking-rate-val tabular-nums">
            {formatCurrency(pricePerNight)}
            <span className="booking-rate-unit">&nbsp;/ night</span>
          </div>
        </div>
        <div className="booking-rate-badge">
          <CheckCircle2 size={14} color="var(--color-primary)" /> Instant Booking
        </div>
      </div>

      {validationError && (
        <div role="alert" aria-live="polite" className="booking-validation-error">
          {validationError}
        </div>
      )}

      {/* Date Range & Guests Segmented Box */}
      <div className="booking-segmented-box">
        <div className="booking-segment-row">
          <div className="booking-segment">
            <label htmlFor="booking-check-in" className="booking-segment-label">
              <Calendar size={13} aria-hidden="true" /> Check-in Date
            </label>
            <input
              id="booking-check-in"
              name="checkIn"
              type="date"
              className="booking-segment-input"
              min={formatDateForInput(new Date())}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) {
                  const next = new Date(e.target.value);
                  next.setDate(next.getDate() + 1);
                  setCheckOut(formatDateForInput(next));
                }
              }}
              required
            />
          </div>

          <div className="booking-segment">
            <label htmlFor="booking-check-out" className="booking-segment-label">
              <Calendar size={13} aria-hidden="true" /> Check-out Date
            </label>
            <input
              id="booking-check-out"
              name="checkOut"
              type="date"
              className="booking-segment-input"
              min={checkIn || formatDateForInput(new Date())}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="booking-segment booking-segment-full">
          <label htmlFor="booking-guests-num" className="booking-segment-label">
            <Users size={13} aria-hidden="true" /> Number of Guests
          </label>
          <select
            id="booking-guests-num"
            name="guests"
            className="booking-segment-select"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {Array.from({ length: room?.capacity || 4 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}&nbsp;{num === 1 ? 'Guest' : 'Guests'} (Max {room?.capacity || 4})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional Special Note */}
      <div className="booking-field-group">
        <label htmlFor="booking-special-note" className="booking-field-label">
          Special Requests or Dietary Preferences (Optional)
        </label>
        <textarea
          id="booking-special-note"
          rows="2"
          className="booking-textarea"
          placeholder="e.g. Quiet room preferred, early luggage drop-off, ground floor request…"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
        />
      </div>

      {/* Transparent Price Breakdown */}
      <div className="booking-price-breakdown">
        <h4 className="price-breakdown-title">Transparent Price Breakdown</h4>
        <div className="breakdown-line">
          <span>{formatCurrency(pricePerNight)} &times; {nights}&nbsp;{nights === 1 ? 'night' : 'nights'}</span>
          <span className="tabular-nums">{formatCurrency(estimatedTotal)}</span>
        </div>
        <div className="breakdown-line">
          <span>Goods & Services Tax (12% GST)</span>
          <span className="tabular-nums">{formatCurrency(taxesAndFees)}</span>
        </div>
        <div className="breakdown-line">
          <span>StayEase Platform & Processing Fee</span>
          <span className="free-tag">WAIVED (₹0)</span>
        </div>
        <div className="breakdown-total-line">
          <span>Total Amount Payable</span>
          <span className="total-sum tabular-nums">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Trust reassurance note */}
      <div className="booking-security-note">
        <ShieldCheck size={16} color="var(--color-primary)" aria-hidden="true" />
        <span>Price calculated dynamically by server. Free cancellation up to 48h prior to arrival.</span>
      </div>

      {/* CTA Button */}
      <button
        type="submit"
        className="btn btn-primary btn-submit-reservation"
        disabled={isSubmitting || nights <= 0}
      >
        {isSubmitting ? (
          <span>Securing Your Reservation…</span>
        ) : (
          <>
            <Lock size={16} aria-hidden="true" />
            <span>Confirm & Reserve Room &bull; {formatCurrency(grandTotal)}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default BookingForm;
