import React, { useState, useEffect } from 'react';
import hotelService from '../../services/hotelService';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit2, Trash2, Users, BedDouble, AlertTriangle } from 'lucide-react';

const INITIAL_ROOMS = [
  {
    _id: 'rm-1',
    hotelId: { _id: 'hotel-1', name: 'The House of Mangaldas Girdhardas' },
    roomNumber: '101',
    roomType: 'Deluxe Heritage Suite',
    pricePerNight: 5800,
    capacity: 2,
    description: 'Heritage teak wood interior, courtyard facing balcony.',
    amenities: ['Free Wi-Fi', 'King Bed', 'AC', 'Breakfast Included'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
    isAvailable: true
  },
  {
    _id: 'rm-2',
    hotelId: { _id: 'hotel-1', name: 'The House of Mangaldas Girdhardas' },
    roomNumber: '201',
    roomType: 'Palatial Courtyard Suite',
    pricePerNight: 8900,
    capacity: 3,
    description: 'Palatial suite with private living room and marble soaking tub.',
    amenities: ['Private Living Room', 'Bathtub', 'High-Speed Wi-Fi', 'AC'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
    isAvailable: true
  },
  {
    _id: 'rm-3',
    hotelId: { _id: 'hotel-2', name: 'The Oberoi Grand Marine View' },
    roomNumber: '304',
    roomType: 'Executive Ocean Suite',
    pricePerNight: 14500,
    capacity: 2,
    description: 'Full Arabian sea view with dedicated butler service.',
    amenities: ['Ocean View', 'King Bed', 'Complimentary Champagne', 'AC'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
    isAvailable: true
  }
];

const AdminRooms = () => {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    hotelId: '',
    roomNumber: '101',
    roomType: 'Deluxe',
    pricePerNight: 5500,
    capacity: 2,
    description: '',
    amenities: 'Free Wi-Fi, King Bed, AC, Breakfast Included',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, hotelsRes] = await Promise.all([
        hotelService.getRooms(),
        hotelService.getHotels()
      ]);
      if (roomsRes && roomsRes.data && roomsRes.data.rooms) {
        setRooms(roomsRes.data.rooms);
      }
      if (hotelsRes && hotelsRes.data && hotelsRes.data.hotels) {
        setHotels(hotelsRes.data.hotels);
      }
    } catch (err) {
      console.warn('API fallback for rooms active:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      hotelId: hotels[0]?._id || 'hotel-1',
      roomNumber: `${Math.floor(100 + Math.random() * 400)}`,
      roomType: 'Deluxe',
      pricePerNight: 5000,
      capacity: 2,
      description: '',
      amenities: 'Free Wi-Fi, King Bed, AC, Breakfast Included',
      images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      isAvailable: true
    });
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      hotelId: room.hotelId?._id || room.hotelId || '',
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities || '',
      images: Array.isArray(room.images) ? room.images.join(', ') : room.images || '',
      isAvailable: room.isAvailable
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      capacity: Number(formData.capacity),
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingRoom) {
        await hotelService.updateRoom(editingRoom._id || editingRoom.id, payload);
      } else {
        await hotelService.createRoom(payload);
      }
      fetchData();
      setModalOpen(false);
    } catch (err) {
      // Local fallback simulator
      if (editingRoom) {
        setRooms((prev) =>
          prev.map((r) => ((r._id || r.id) === (editingRoom._id || editingRoom.id) ? { ...r, ...payload } : r))
        );
      } else {
        const selectedHotel = hotels.find((h) => h._id === payload.hotelId) || { name: 'StayEase Hotel' };
        const newRoom = { ...payload, _id: `rm-${Date.now()}`, hotelId: selectedHotel };
        setRooms((prev) => [newRoom, ...prev]);
      }
      setModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await hotelService.deleteRoom(deleteConfirmId);
      fetchData();
    } catch (err) {
      // Local fallback simulator
      setRooms((prev) => prev.filter((r) => (r._id || r.id) !== deleteConfirmId));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <span className="section-eyebrow">Room Inventory</span>
          <h1 className="admin-page-title">
            Suites & Room Management
          </h1>
          <p className="admin-page-desc">
            Configure room types, pricing, guest capacities, and real-time inventory states.
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} aria-hidden="true" /> Add New Suite
        </button>
      </div>

      {loading ? (
        <Loader message="Loading rooms inventory…" />
      ) : (
        <div className="admin-card-surface">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Configured Room Inventory</h3>
              <p className="admin-card-subtitle">{rooms.length} suites actively configured in the database.</p>
            </div>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th scope="col">Suite & Number</th>
                  <th scope="col">Property</th>
                  <th scope="col">Capacity</th>
                  <th scope="col">Price / Night</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id || r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={r.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80'}
                          alt={r.roomType}
                          style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                          loading="lazy"
                        />
                        <div>
                          <strong className="table-primary-text">{r.roomType}</strong>
                          <div className="table-secondary-text">Suite #{r.roomNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-primary-text">{r.hotelId?.name || 'Assigned Property'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-ink)' }}>
                        <Users size={13} color="var(--color-primary)" /> {r.capacity}&nbsp;{r.capacity === 1 ? 'Guest' : 'Guests'}
                      </div>
                    </td>
                    <td>
                      <div className="tabular-nums font-semibold" style={{ color: 'var(--color-ink)' }}>
                        {formatCurrency(r.pricePerNight)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${r.isAvailable ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {r.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(r)}
                          className="btn btn-secondary btn-sm"
                          aria-label={`Edit ${r.roomType}`}
                          title="Edit Room"
                        >
                          <Edit2 size={13} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(r._id || r.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--color-danger)', borderColor: 'rgba(197, 48, 48, 0.25)' }}
                          aria-label={`Delete ${r.roomType}`}
                          title="Delete Room"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Room Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRoom ? 'Edit Room Configuration' : 'Add Room to Inventory'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Hotel</label>
            <select
              className="form-control"
              value={formData.hotelId}
              onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
              required
            >
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <input
                type="text"
                className="form-control"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                placeholder="e.g. Deluxe Suite, Executive"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price per Night (₹)</label>
              <input
                type="number"
                min="500"
                step="100"
                className="form-control"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Guest Capacity</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amenities (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URLs (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="room-avail-check"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="room-avail-check" style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--color-ink)' }}>
              Mark this suite as currently available for live bookings
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRoom ? 'Save Changes' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Room Deletion"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-danger)', marginBottom: '1rem' }}>
            <AlertTriangle size={24} />
            <strong>Are you sure you want to remove this room?</strong>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            This room will be permanently removed from inventory. Active bookings associated with this room will remain for historical logging.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
              Keep Room
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
              onClick={handleDelete}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRooms;
