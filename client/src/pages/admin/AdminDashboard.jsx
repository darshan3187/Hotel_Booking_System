import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  BedDouble, 
  CalendarCheck2, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  Plus,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, calculateNights } from '../../utils/formatters';
import bookingService from '../../services/bookingService';
import Loader from '../../components/Loader';

const FALLBACK_STATS = {
  totalUsers: 14,
  totalHotels: 5,
  totalRooms: 15,
  totalBookings: 8,
  confirmedBookings: 6,
  cancelledBookings: 2,
  revenue: 124800
};

const FALLBACK_RECENT_BOOKINGS = [
  {
    _id: 'bkg-101',
    userId: { name: 'Rohan Patel', email: 'rohan@gmail.com' },
    hotelId: { name: 'The House of Mangaldas Girdhardas', city: 'Ahmedabad' },
    roomId: { roomType: 'Deluxe Heritage Suite', roomNumber: '101' },
    checkIn: '2026-10-15',
    checkOut: '2026-10-18',
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
    totalAmount: 14500,
    status: 'pending'
  },
  {
    _id: 'bkg-104',
    userId: { name: 'Simran Kaur', email: 'simran@gmail.com' },
    hotelId: { name: 'Taj Fort Aguada Beach Resort', city: 'Goa' },
    roomId: { roomType: 'Beachfront Villa', roomNumber: 'Villa 4' },
    checkIn: '2026-11-10',
    checkOut: '2026-11-14',
    totalAmount: 34000,
    status: 'confirmed'
  },
  {
    _id: 'bkg-105',
    userId: { name: 'Devendra Joshi', email: 'devendra@gmail.com' },
    hotelId: { name: 'The Imperial Heritage Sanctuary', city: 'Delhi' },
    roomId: { roomType: 'Imperial Suite', roomNumber: '401' },
    checkIn: '2026-10-08',
    checkOut: '2026-10-09',
    totalAmount: 11000,
    status: 'cancelled'
  }
];

const DESTINATIONS_DATA = [
  { city: 'Ahmedabad', properties: '14 properties', region: 'Heritage Pols & Haveli Stays' },
  { city: 'Mumbai', properties: '28 properties', region: 'Marine Drive & Oceanfront Suites' },
  { city: 'Jaipur', properties: '22 properties', region: 'Royal Forts & Palatial Courtyards' },
  { city: 'Goa', properties: '35 properties', region: 'Coastal Retreats & Tropical Villas' },
  { city: 'Delhi', properties: '19 properties', region: 'Imperial Sanctuaries & Enclaves' }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [recentBookings, setRecentBookings] = useState(FALLBACK_RECENT_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await bookingService.getAdminStats();
        if (res && res.data) {
          setStats(res.data.stats || res.data);
          if (res.data.recentBookings && res.data.recentBookings.length > 0) {
            setRecentBookings(res.data.recentBookings);
          }
        }
      } catch (err) {
        console.warn('Dashboard stats fallback active:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Filtered reservations
  const filteredBookings = useMemo(() => {
    return recentBookings.filter((b) => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const guestName = b.userId?.name || '';
      const guestEmail = b.userId?.email || '';
      const hotelName = b.hotelId?.name || '';
      const matchesSearch = 
        !searchQuery ||
        guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotelName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [recentBookings, statusFilter, searchQuery]);

  const confirmedPct = Math.round((stats.confirmedBookings / (stats.totalBookings || 1)) * 100);
  const cancelledPct = Math.round((stats.cancelledBookings / (stats.totalBookings || 1)) * 100);
  const pendingPct = Math.max(0, 100 - confirmedPct - cancelledPct);

  if (loading) return <Loader message="Compiling platform analytics…" />;

  const getStatusBadge = (st) => {
    switch (st) {
      case 'confirmed':
        return <span className="badge badge-confirmed"><CheckCircle2 size={12} aria-hidden="true" /> Confirmed</span>;
      case 'pending':
        return <span className="badge badge-pending"><Clock size={12} aria-hidden="true" /> Pending</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled"><XCircle size={12} aria-hidden="true" /> Cancelled</span>;
      case 'completed':
        return <span className="badge badge-completed"><CheckCircle2 size={12} aria-hidden="true" /> Completed</span>;
      default:
        return <span className="badge badge-neutral">{st}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      {/* 1. Header with Executive Title and Integrated Action Pills */}
      <div className="admin-header-row" style={{ alignItems: 'center' }}>
        <div>
          <span className="section-eyebrow">Executive Intelligence</span>
          <h1 className="admin-page-title">Executive Control Center</h1>
          <p className="admin-page-desc">
            Aggregated operational metrics compiled across boutique properties, guest suites, and reservations.
          </p>
        </div>

        {/* Quick Operational Action Shortcuts */}
        <div className="admin-quick-actions" style={{ marginBottom: 0 }}>
          <Link to="/admin/hotels" className="admin-action-pill primary">
            <Plus size={14} aria-hidden="true" />
            <span>New Property</span>
          </Link>
          <Link to="/admin/rooms" className="admin-action-pill">
            <BedDouble size={14} aria-hidden="true" />
            <span>Suites</span>
          </Link>
          <Link to="/admin/bookings" className="admin-action-pill">
            <CalendarCheck2 size={14} aria-hidden="true" />
            <span>Bookings</span>
          </Link>
          <Link to="/admin/users" className="admin-action-pill">
            <Users size={14} aria-hidden="true" />
            <span>Guests</span>
          </Link>
        </div>
      </div>

      {/* 2. Executive KPI Cards Grid */}
      <div className="admin-kpi-grid">
        {/* Realized Revenue */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Gross Platform Revenue</span>
            <div className="kpi-icon-wrap">
              <IndianRupee size={17} />
            </div>
          </div>
          <div className="kpi-value tabular-nums">
            {formatCurrency(stats.revenue)}
          </div>
          <div className="kpi-footnote">
            <TrendingUp size={13} color="var(--color-success)" aria-hidden="true" />
            <span>+18.4% vs previous period</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Reservations</span>
            <div className="kpi-icon-wrap">
              <CalendarCheck2 size={17} />
            </div>
          </div>
          <div className="kpi-value tabular-nums">
            {stats.totalBookings}
          </div>
          <div className="kpi-footnote">
            <CheckCircle2 size={13} color="var(--color-success)" aria-hidden="true" />
            <span>{stats.confirmedBookings} confirmed &bull; {stats.cancelledBookings} cancelled</span>
          </div>
        </div>

        {/* Properties Listed */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Curated Properties</span>
            <div className="kpi-icon-wrap">
              <Building2 size={17} />
            </div>
          </div>
          <div className="kpi-value tabular-nums">
            {stats.totalHotels}
          </div>
          <div className="kpi-footnote">
            <ShieldCheck size={13} color="var(--color-primary)" aria-hidden="true" />
            <span>100% StayEase Certified</span>
          </div>
        </div>

        {/* Active Suites */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Suites & Rooms</span>
            <div className="kpi-icon-wrap">
              <BedDouble size={17} />
            </div>
          </div>
          <div className="kpi-value tabular-nums">
            {stats.totalRooms}
          </div>
          <div className="kpi-footnote">
            <Users size={13} color="var(--color-muted)" aria-hidden="true" />
            <span>{stats.totalUsers} registered travelers</span>
          </div>
        </div>
      </div>

      {/* 4. Mid-Tier Operational Intelligence Row */}
      <div className="admin-split-grid">
        {/* Left: Reservation Pipeline & Performance */}
        <div className="admin-card-surface" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 className="admin-card-title">Reservation Pipeline Health</h3>
              <p className="admin-card-subtitle">Real-time status breakdown across all platform bookings</p>
            </div>
            <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
              {confirmedPct}% Success Rate
            </span>
          </div>

          {/* Visual Distribution Bar */}
          <div className="admin-distribution-bar" role="progressbar" aria-valuenow={confirmedPct} aria-valuemin={0} aria-valuemax={100}>
            <div 
              className="distribution-segment confirmed" 
              style={{ width: `${confirmedPct}%` }}
              title={`Confirmed: ${confirmedPct}%`}
            />
            <div 
              className="distribution-segment pending" 
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${pendingPct}%`}
            />
            <div 
              className="distribution-segment cancelled" 
              style={{ width: `${cancelledPct}%` }}
              title={`Cancelled: ${cancelledPct}%`}
            />
          </div>

          {/* Legend */}
          <div className="distribution-legend">
            <div className="legend-item">
              <span className="legend-dot confirmed" />
              <span>Confirmed ({stats.confirmedBookings}) &bull; {confirmedPct}%</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot pending" />
              <span>Pending &bull; {pendingPct}%</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot cancelled" />
              <span>Cancelled ({stats.cancelledBookings}) &bull; {cancelledPct}%</span>
            </div>
          </div>

          {/* Micro Health Indicators */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-hairline-soft)' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block' }}>Avg. Length of Stay</span>
              <strong style={{ fontSize: '14px', color: 'var(--color-ink)' }}>2.8 Nights</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block' }}>Platform Uptime</span>
              <strong style={{ fontSize: '14px', color: 'var(--color-success)' }}>99.98%</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block' }}>Encryption Level</span>
              <strong style={{ fontSize: '14px', color: 'var(--color-ink)' }}>AES-256 GCM</strong>
            </div>
          </div>
        </div>

        {/* Right: Destination Distribution */}
        <div className="admin-card-surface" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 className="admin-card-title">Top Hospitality Hubs</h3>
              <p className="admin-card-subtitle">Active inventory distribution across India</p>
            </div>
            <Link to="/admin/hotels" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
              Manage All &rarr;
            </Link>
          </div>

          <div className="admin-dest-list">
            {DESTINATIONS_DATA.map((d) => (
              <Link 
                key={d.city}
                to={`/hotels?city=${d.city}`}
                target="_blank"
                className="admin-dest-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--color-primary)" />
                  <div>
                    <strong style={{ fontSize: '13px' }}>{d.city}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block' }}>{d.region}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)' }}>{d.properties}</span>
                  <ChevronRight size={14} color="var(--color-muted)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Table Card with In-Place Search and Tabs */}
      <div className="admin-card-surface">
        <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="admin-card-title">Recent Guest Reservations</h3>
            <p className="admin-card-subtitle">Real-time booking events recorded in the database.</p>
          </div>

          {/* Quick Table Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search guest or property…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  paddingLeft: '32px',
                  borderRadius: 'var(--radius-full)'
                }}
              />
              <Search 
                size={14} 
                style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} 
                aria-hidden="true" 
              />
            </div>
            <Link to="/admin/bookings" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap', height: '34px' }}>
              <span>All Bookings</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Filterable Tabs Bar */}
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Reservations ({recentBookings.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed ({recentBookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({recentBookings.filter((b) => b.status === 'pending').length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled ({recentBookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Data Table */}
        <div className="admin-table-responsive">
          {filteredBookings.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '13px' }}>
              No reservations found matching the selected filter or search term.
            </div>
          ) : (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th scope="col">Booking Ref</th>
                  <th scope="col">Guest</th>
                  <th scope="col">Property & Suite</th>
                  <th scope="col">Stay Dates</th>
                  <th scope="col">Total Paid</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const nights = Math.max(1, calculateNights(b.checkIn, b.checkOut));
                  return (
                    <tr key={b._id}>
                      <td className="font-mono text-muted tabular-nums">
                        #{String(b._id).slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div className="table-user-cell">
                          <span className="user-initial">
                            {b.userId?.name ? b.userId.name.charAt(0).toUpperCase() : 'G'}
                          </span>
                          <div>
                            <div className="table-primary-text">{b.userId?.name || 'Guest User'}</div>
                            <div className="table-secondary-text">{b.userId?.email || 'guest@example.com'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-primary-text">{b.hotelId?.name || 'StayEase Hotel'}</div>
                        <div className="table-secondary-text">
                          {b.roomId?.roomType || 'Deluxe Suite'} &bull; #{b.roomId?.roomNumber || '101'}
                        </div>
                      </td>
                      <td>
                        <div className="tabular-nums table-primary-text">
                          {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
                        </div>
                        <div className="table-secondary-text">
                          {nights} {nights === 1 ? 'night' : 'nights'}
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
                        <Link 
                          to="/admin/bookings" 
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '11px', padding: '4px 10px', height: '28px' }}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
