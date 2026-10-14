import React, { useState, useEffect } from 'react';
import hotelService from '../../services/hotelService';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Edit2, Trash2, MapPin, Star, AlertTriangle, Building2 } from 'lucide-react';

const INITIAL_HOTELS = [
  {
    _id: 'hotel-1',
    name: 'The House of Mangaldas Girdhardas',
    city: 'Ahmedabad',
    location: 'Lal Darwaza, Ahmedabad',
    address: 'Opp. Sidi Saiyyed Mosque, Lal Darwaza, Ahmedabad 380001',
    rating: 4.9,
    description: 'Heritage Indo-Saracenic mansion set around private courtyards.',
    amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa & Wellness', 'Fine Dining Restaurant'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
  },
  {
    _id: 'hotel-2',
    name: 'The Oberoi Grand Marine View',
    city: 'Mumbai',
    location: 'Nariman Point, Mumbai',
    address: 'Nariman Point, Marine Drive, Mumbai 400021',
    rating: 4.8,
    description: 'Iconic luxury hotel overlooking the Arabian Sea and Marine Drive promenade.',
    amenities: ['Oceanfront Pool', 'Michelin-star Dining', 'Free Wi-Fi', 'Valet Parking'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80']
  },
  {
    _id: 'hotel-3',
    name: 'Jai Mahal Heritage Palace',
    city: 'Jaipur',
    location: 'Civil Lines, Jaipur',
    address: 'Jacob Road, Civil Lines, Jaipur 302006',
    rating: 4.9,
    description: '18th-century Rajput palace surrounded by 18 acres of Mughal gardens.',
    amenities: ['Royal Gardens', 'Swimming Pool', 'Ayurvedic Spa', 'Free Wi-Fi'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80']
  }
];

const AdminHotels = () => {
  const [hotels, setHotels] = useState(INITIAL_HOTELS);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    city: 'Ahmedabad',
    location: '',
    address: '',
    rating: 4.8,
    description: '',
    amenities: 'Free Wi-Fi, Swimming Pool, Spa & Wellness, Fine Dining Restaurant',
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  });

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await hotelService.getHotels();
      if (res && res.data && res.data.hotels) {
        setHotels(res.data.hotels);
      }
    } catch (err) {
      console.warn('API fallback for hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const openCreateModal = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      city: 'Ahmedabad',
      location: '',
      address: '',
      rating: 4.8,
      description: '',
      amenities: 'Free Wi-Fi, Swimming Pool, Spa & Wellness, Fine Dining Restaurant',
      images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    });
    setModalOpen(true);
  };

  const openEditModal = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      city: hotel.city,
      location: hotel.location,
      address: hotel.address || '',
      rating: hotel.rating,
      description: hotel.description,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : hotel.amenities || '',
      images: Array.isArray(hotel.images) ? hotel.images.join(', ') : hotel.images || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      rating: Number(formData.rating),
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel._id || editingHotel.id, payload);
      } else {
        await hotelService.createHotel(payload);
      }
      fetchHotels();
      setModalOpen(false);
    } catch (err) {
      // Local fallback simulator
      if (editingHotel) {
        setHotels((prev) =>
          prev.map((h) => ((h._id || h.id) === (editingHotel._id || editingHotel.id) ? { ...h, ...payload } : h))
        );
      } else {
        const newHotel = { ...payload, _id: `hotel-${Date.now()}` };
        setHotels((prev) => [newHotel, ...prev]);
      }
      setModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await hotelService.deleteHotel(deleteConfirmId);
      fetchHotels();
    } catch (err) {
      // Local fallback simulator
      setHotels((prev) => prev.filter((h) => (h._id || h.id) !== deleteConfirmId));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <span className="section-eyebrow">Property Directory</span>
          <h1 className="admin-page-title">
            Properties & Sanctuaries
          </h1>
          <p className="admin-page-desc">
            Manage boutique hotel listings, locations, photographic galleries, and guest amenities.
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} aria-hidden="true" /> Add New Property
        </button>
      </div>

      {loading ? (
        <Loader message="Loading hotels…" />
      ) : (
        <div className="admin-card-surface">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Curated Hotel Roster</h3>
              <p className="admin-card-subtitle">{hotels.length} properties currently listed across India.</p>
            </div>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Curated Amenities</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h._id || h.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={h.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'}
                          alt={h.name}
                          style={{ width: '60px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                          loading="lazy"
                        />
                        <div>
                          <strong className="table-primary-text">{h.name}</strong>
                          <div className="table-secondary-text">ID: #{String(h._id || h.id).slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-primary-text">{h.city}</div>
                      <div className="table-secondary-text">{h.location}</div>
                    </td>
                    <td>
                      <span className="badge badge-accent tabular-nums">
                        <Star size={12} fill="var(--color-primary)" color="var(--color-primary)" /> {h.rating}
                      </span>
                    </td>
                    <td>
                      <span className="table-secondary-text">
                        {Array.isArray(h.amenities) ? h.amenities.slice(0, 2).join(', ') : ''}
                        {Array.isArray(h.amenities) && h.amenities.length > 2 ? ` +${h.amenities.length - 2} more` : ''}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(h)}
                          className="btn btn-secondary btn-sm"
                          aria-label={`Edit ${h.name}`}
                          title="Edit Hotel"
                        >
                          <Edit2 size={13} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(h._id || h.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--color-danger)', borderColor: 'rgba(197, 48, 48, 0.25)' }}
                          aria-label={`Delete ${h.name}`}
                          title="Delete Hotel"
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

      {/* Create / Edit Hotel Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHotel ? 'Edit Property Details' : 'Register New Property'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Property Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="form-control"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location / Neighborhood</label>
            <input
              type="text"
              className="form-control"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Lal Darwaza, Ahmedabad"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Postal Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Detailed street address"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingHotel ? 'Save Changes' : 'Register Property'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Property Deletion"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-danger)', marginBottom: '1rem' }}>
            <AlertTriangle size={24} />
            <strong>Are you sure you want to delete this property?</strong>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Deleting this property will also affect all configured rooms associated with it. This operation cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
              Keep Property
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

export default AdminHotels;
