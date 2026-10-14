import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';

const COMMON_CITIES = ['All Cities', 'Ahmedabad', 'Mumbai', 'Delhi', 'Jaipur', 'Goa'];
const ROOM_TYPES = ['All Types', 'Standard', 'Deluxe', 'Suite', 'Family'];
const AMENITY_OPTIONS = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Spa & Wellness',
  'Fine Dining Restaurant',
  'Free Parking',
  'Fitness Center',
  'Air Conditioning'
];

const FilterPanel = ({ filters, onChange, onReset, isMobile = false, onCloseMobile }) => {
  const handleCheckboxChange = (amenity) => {
    const currentAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    let updated;
    if (currentAmenities.includes(amenity)) {
      updated = currentAmenities.filter((a) => a !== amenity);
    } else {
      updated = [...currentAmenities, amenity];
    }
    onChange({ amenities: updated.join(',') });
  };

  const hasActiveFilters = Boolean(
    filters.city ||
    filters.roomType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rating ||
    filters.amenities
  );

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--color-hairline-soft)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--color-ink)' }}>
          <Filter size={18} color="var(--color-primary)" aria-hidden="true" />
          <span style={{ fontSize: '16px' }}>Filter Stays</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '12px', padding: '4px 10px', height: '30px', display: 'flex', gap: '4px' }}
          >
            <RotateCcw size={12} aria-hidden="true" /> Reset
          </button>
        )}
      </div>

      {/* 1. Destination / City */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="filter-city" className="form-label">Destination</label>
        <select
          id="filter-city"
          className="form-select"
          value={filters.city || ''}
          onChange={(e) => onChange({ city: e.target.value === 'All Cities' ? '' : e.target.value })}
        >
          {COMMON_CITIES.map((c) => (
            <option key={c} value={c === 'All Cities' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Room Type */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label htmlFor="filter-room-type" className="form-label">Room Type</label>
        <select
          id="filter-room-type"
          className="form-select"
          value={filters.roomType || ''}
          onChange={(e) => onChange({ roomType: e.target.value === 'All Types' ? '' : e.target.value })}
        >
          {ROOM_TYPES.map((rt) => (
            <option key={rt} value={rt === 'All Types' ? '' : rt}>
              {rt}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Price Range */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label">
          Price Range: ₹{filters.minPrice || 1000} &ndash; ₹{filters.maxPrice || 25000}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label htmlFor="filter-min-price" style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', marginBottom: '2px' }}>Min Rate</label>
            <input
              id="filter-min-price"
              type="number"
              placeholder="₹ 1,000"
              className="form-control"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              min={0}
              step={500}
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', marginBottom: '2px' }}>Max Rate</label>
            <input
              id="filter-max-price"
              type="number"
              placeholder="₹ 25,000"
              className="form-control"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              min={0}
              step={500}
            />
          </div>
        </div>
      </div>

      {/* 4. Minimum Rating */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label">Minimum Rating</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[0, 3, 4, 4.5].map((val) => {
            const isSelected = Number(filters.rating) === val || (val === 0 && !filters.rating);
            return (
              <button
                key={val}
                type="button"
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '6px 4px',
                  fontSize: '12px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => onChange({ rating: val === 0 ? '' : val })}
              >
                {val === 0 ? 'Any' : `${val}+ ★`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Amenities Checkboxes */}
      <div className="form-group">
        <label className="form-label" style={{ marginBottom: '8px' }}>Amenities</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AMENITY_OPTIONS.map((item) => {
            const isChecked = filters.amenities && filters.amenities.split(',').includes(item);
            return (
              <label
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: isChecked ? 'var(--color-ink)' : 'var(--color-body)',
                  fontWeight: isChecked ? 600 : 400
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(isChecked)}
                  onChange={() => handleCheckboxChange(item)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      {isMobile && onCloseMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '24px' }}
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
