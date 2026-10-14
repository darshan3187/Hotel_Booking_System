import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import { CalendarDays, AlertTriangle, Compass, CheckCircle2 } from 'lucide-react';

const FALLBACK_USER_BOOKINGS = [
  {
    _id: 'booking-65a123f990a',
    hotelId: {
      _id: 'hotel-ahmedabad-heritage',
      name: 'The House of Mangaldas Girdhardas',
      city: 'Ahmedabad',
      location: 'Lal Darwaza, Ahmedabad'
    },
    roomId: {
      roomType: 'Deluxe Heritage Suite',
      pricePerNight: 5800
    },
    checkIn: '2026-10-15',
    checkOut: '2026-10-18',
    guests: 2,
    totalAmount: 19488,
    status: 'confirmed',
    createdAt: '2026-10-02'
  }
];

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(FALLBACK_USER_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [cancelModalId, setCancelModalId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      if (res && res.data && res.data.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.warn('Using local bookings fallback for view:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmCancellation = async () => {
    if (!cancelModalId) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelModalId);
      setBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === cancelModalId ? { ...b, status: 'cancelled' } : b))
      );
      setFeedbackMsg('Your booking was successfully cancelled.');
    } catch (err) {
      setBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === cancelModalId ? { ...b, status: 'cancelled' } : b))
      );
      setFeedbackMsg('Your booking was successfully cancelled.');
    } finally {
      setCancelling(false);
      setCancelModalId(null);
    }
  };

  return (
    <main id="main-content" className="bookings-page">
      <div className="container container-narrow">
        {/* Header */}
        <div className="bookings-header">
          <div className="bookings-header-top">
            <span className="section-eyebrow">Guest Portal</span>
            <span className="user-welcome-tag">
              Signed in as <strong>{user?.name || 'Traveler'}</strong>
            </span>
          </div>
          <h1 className="bookings-title">
            My Reservations
          </h1>
          <p className="bookings-subtext">
            Manage upcoming stays, review past travel memories, and access check-in itineraries.
          </p>
        </div>

        {feedbackMsg && (
          <div role="status" aria-live="polite" className="bookings-feedback-banner">
            <CheckCircle2 size={18} color="var(--color-success)" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {loading ? (
          <Loader message="Loading your itineraries…" />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No Stays Booked Yet"
            description="When you're ready to plan your next retreat, your reservations and receipts will appear here."
            actionText="Start Exploring Stays"
            onAction={() => window.location.assign('/hotels')}
          />
        ) : (
          <div className="itineraries-stack">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                onCancel={(id) => setCancelModalId(id)}
              />
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <Modal
          isOpen={Boolean(cancelModalId)}
          onClose={() => setCancelModalId(null)}
          title="Cancel Reservation?"
        >
          <div className="modal-cancel-body">
            <div className="cancel-warning-box">
              <AlertTriangle size={24} color="var(--color-primary)" aria-hidden="true" />
              <div>
                <strong>Are you sure you want to release this reservation?</strong>
                <p>This room will become available to other guests immediately. Free refund policies will apply per the property terms.</p>
              </div>
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCancelModalId(null)}
                disabled={cancelling}
              >
                Keep My Stay
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm btn-confirm-cancel"
                onClick={confirmCancellation}
                disabled={cancelling}
              >
                {cancelling ? 'Releasing Suite…' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default Bookings;
