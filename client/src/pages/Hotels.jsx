import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import hotelService from '../services/hotelService';
import { SlidersHorizontal, ArrowUpDown, X, MapPin } from 'lucide-react';

import { filterHotels, HOTELS_DATA } from '../data/hotelsData';

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState(HOTELS_DATA);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL query params
  const cityQuery = searchParams.get('city') || '';
  const searchQuery = searchParams.get('search') || '';
  const minPriceQuery = searchParams.get('minPrice') || '';
  const maxPriceQuery = searchParams.get('maxPrice') || '';
  const ratingQuery = searchParams.get('rating') || '';
  const roomTypeQuery = searchParams.get('roomType') || '';
  const amenitiesQuery = searchParams.get('amenities') || '';
  const checkInQuery = searchParams.get('checkIn') || '';
  const checkOutQuery = searchParams.get('checkOut') || '';
  const guestsQuery = searchParams.get('guests') || '';

  const filters = {
    city: cityQuery,
    search: searchQuery,
    minPrice: minPriceQuery,
    maxPrice: maxPriceQuery,
    rating: ratingQuery,
    roomType: roomTypeQuery,
    amenities: amenitiesQuery
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const query = Object.fromEntries(searchParams.entries());
        const res = await hotelService.getHotels(query);
        if (res && res.data && res.data.hotels) {
          setHotels(res.data.hotels);
        } else {
          setHotels(filterHotels({ ...filters, sortBy }));
        }
      } catch (err) {
        // Client-side dataset filtering fallback
        setHotels(filterHotels({ ...filters, sortBy }));
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams, sortBy]);

  const handleFilterChange = (newFilters) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const removeFilterParam = (key) => {
    const updated = new URLSearchParams(searchParams);
    updated.delete(key);
    setSearchParams(updated);
  };

  // Sorted hotels
  const sortedHotels = useMemo(() => {
    let list = [...hotels];
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [hotels, sortBy]);

  return (
    <main id="main-content" style={{ backgroundColor: 'var(--color-canvas)', minHeight: '85vh', paddingBottom: '72px' }}>
      {/* Top Search Bar Header Band */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-hairline)', padding: '24px 0 20px' }}>
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <SearchBar
              initialCity={cityQuery}
              initialCheckIn={checkInQuery}
              initialCheckOut={checkOutQuery}
              initialGuests={Number(guestsQuery) || 2}
            />
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '32px' }}>
        {/* Page Heading & Search Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="section-eyebrow">Curated Collection</span>
            <h1 className="editorial-headline" style={{ color: 'var(--color-ink)' }}>
              {cityQuery ? `Stays in ${cityQuery}` : 'Explore All Stays'}
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>
              Showing {sortedHotels.length} {sortedHotels.length === 1 ? 'exceptional property' : 'exceptional properties'} verified for authentic hospitality
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-secondary btn-sm mobile-filter-btn"
              aria-label="Open filter panel"
            >
              <SlidersHorizontal size={15} aria-hidden="true" /> Filters
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={15} color="var(--color-muted)" aria-hidden="true" />
              <label htmlFor="hotel-sort-select" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                Sort:
              </label>
              <select
                id="hotel-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{
                  height: '38px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  width: 'auto',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(cityQuery || minPriceQuery || maxPriceQuery || ratingQuery || roomTypeQuery) && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {cityQuery && (
              <span className="badge-guest-favorite" style={{ fontSize: '12px', padding: '4px 10px' }}>
                City: {cityQuery}
                <button
                  type="button"
                  onClick={() => removeFilterParam('city')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  aria-label={`Remove ${cityQuery} filter`}
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </span>
            )}
            {ratingQuery && (
              <span className="badge-guest-favorite" style={{ fontSize: '12px', padding: '4px 10px' }}>
                {ratingQuery}+ Stars
                <button
                  type="button"
                  onClick={() => removeFilterParam('rating')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  aria-label="Remove rating filter"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </span>
            )}
            {(minPriceQuery || maxPriceQuery) && (
              <span className="badge-guest-favorite" style={{ fontSize: '12px', padding: '4px 10px' }}>
                ₹{minPriceQuery || '0'} &ndash; ₹{maxPriceQuery || '25k'}
                <button
                  type="button"
                  onClick={() => {
                    removeFilterParam('minPrice');
                    removeFilterParam('maxPrice');
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  aria-label="Remove price filter"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content Layout: Filters Sidebar + Hotel Grid */}
        <div className="hotels-layout-container">
          {/* Left Column: Filter Panel (Desktop) */}
          <aside className="hotels-desktop-filter">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Column: Hotel Cards */}
          <section aria-label="Available hotels">
            {loading ? (
              <Loader message="Finding matching properties…" />
            ) : sortedHotels.length === 0 ? (
              <EmptyState
                title="No properties match your filter criteria"
                description="Try loosening your price range or clearing specific amenity filters to view available stays."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="hotels-listing-grid">
                {sortedHotels.map((hotel) => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(29, 29, 31, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 1200,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#ffffff',
              height: '100%',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-float)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Filter Properties</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                aria-label="Close filters"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              isMobile={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Hotels;
