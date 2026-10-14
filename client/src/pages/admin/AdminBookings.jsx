import React, { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import Loader from '../../components/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CalendarCheck2, Clock, CheckCircle2, XCircle } from 'lucide-react';

const FALLBACK_ALL_BOOKINGS = [
  {
    _id: 'bkg-101',
    userId: { name: 'Rohan Patel', email: 'rohan@gmail.com' },
    hotelId: { name: 'The House of Mangaldas Girdhardas', city: 'Ahmedabad' },
    roomId: { roomType: 'Deluxe Heritage Suite', roomNumber: '101' },
    checkIn: '2026-10-15',
    checkOut: '2026-10-18',
    guests: 2,
    totalAmount: 19488,
    status: 'confirmed'
  },
  {
    _id: 'bkg-102',
    userId: { name: 'Pooja Sharma', email: 'pooja@gmail.com' },
    hotelId: { name: 'The Oberoi Grand Marine View', city: 'Mumbai' },
    roomId: { roomType: 'Executive Suite', roomNumber: '204' },
    checkIn: '2026-10-20',
    checkOut: '2026-10-22',
    guests: 2,
    totalAmount: 28000,
    status: 'confirmed'
  },
  {
    _id: 'bkg-103',
    userId: { name: 'Arjun Verma', email: 'arjun@gmail.com' },
    hotelId: { name: 'Jai Mahal Heritage Palace', city: 'Jaipur' },
    roomId: { roomType: 'Standard Room', roomNumber: '302' },
    checkIn: '2026-11-01',
    checkOut: '2026-11-03',
    guests: 1,
    totalAmount: 14500,
    status: 'pending'
  }
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState(FALLBACK_ALL_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAdminBookings();
      if (res && res.data && res.data.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.warn('API fallback for admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await bookingService.updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      // Local mockup state update
      setBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'confirmed':
        return <span className="badge badge-confirmed"><CheckCircle2 size={12} /> Confirmed</span>;
      case 'pending':
        return <span className="badge badge-pending"><Clock size={12} /> Pending</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled"><XCircle size={12} /> Cancelled</span>;
      case 'completed':
        return <span className="badge badge-completed"><CheckCircle2 size={12} /> Completed</span>;
      default:
        return <span className="badge badge-neutral">{st}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <span className="section-eyebrow">Reservation Roster</span>
          <h1 className="admin-page-title">
            Guest Reservations
          </h1>
          <p className="admin-page-desc">
            Monitor real-time reservations, guest check-in intervals, and update arrival statuses.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#ffffff', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-hairline)' }}>
          {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map((st) => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                textTransform: 'capitalize', 
                fontSize: '12px', 
                padding: '6px 14px',
                height: '32px',
                borderRadius: 'var(--radius-xs)'
              }}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader message="Loading reservations…" />
      ) : (
        <div className="admin-card-surface">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Reservation Records</h3>
              <p className="admin-card-subtitle">{filtered.length} bookings matching selected view filter.</p>
            </div>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th scope="col">Booking Ref</th>
                  <th scope="col">Guest</th>
                  <th scope="col">Property & City</th>
                  <th scope="col">Suite & Dates</th>
                  <th scope="col">Total Paid</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Manage Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>
                      <span className="tabular-nums" style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary)', fontSize: '13px' }}>
                        #{String(b._id || b.id).slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <span className="user-initial">
                          {b.userId?.name ? b.userId.name.charAt(0).toUpperCase() : 'G'}
                        </span>
                        <div>
                          <div className="table-primary-text">{b.userId?.name || 'Guest User'}</div>
                          <div className="table-secondary-text">{b.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-primary-text">{b.hotelId?.name}</div>
                      <div className="table-secondary-text">{b.hotelId?.city}</div>
                    </td>
                    <td>
                      <div className="table-primary-text">{b.roomId?.roomType || 'Deluxe Suite'}</div>
                      <div className="table-secondary-text tabular-nums">
                        {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)} ({b.guests}&nbsp;{b.guests === 1 ? 'Guest' : 'Guests'})
                      </div>
                    </td>
                    <td>
                      <div className="tabular-nums font-semibold" style={{ color: 'var(--color-ink)' }}>
                        {formatCurrency(b.totalAmount)}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(b.status)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="form-control"
                        style={{ 
                          fontSize: '12px', 
                          padding: '4px 8px', 
                          width: 'auto',
                          display: 'inline-block',
                          height: '32px',
                          borderRadius: 'var(--radius-xs)'
                        }}
                        value={b.status}
                        disabled={updatingId === (b._id || b.id)}
                        onChange={(e) => handleStatusChange(b._id || b.id, e.target.value)}
                        aria-label={`Change status for booking ${b._id || b.id}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
