import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const DEFAULT_HOTEL_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

const HotelCard = ({ hotel }) => {
  const hotelId = hotel?._id || hotel?.id;

  const [isLiked, setIsLiked] = useState(() => {
    try {
      const saved = localStorage.getItem('stayease_wishlist');
      if (saved) {
        const list = JSON.parse(saved);
        return Array.isArray(list) && list.includes(hotelId);
      }
    } catch (e) {
      // ignore
    }
    return false;
  });

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    try {
      const saved = localStorage.getItem('stayease_wishlist');
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      if (nextState) {
        if (!list.includes(hotelId)) list.push(hotelId);
      } else {
        list = list.filter((id) => id !== hotelId);
      }
      localStorage.setItem('stayease_wishlist', JSON.stringify(list));
    } catch (err) {
      // ignore
    }
  };

  if (!hotel) return null;

  const {
    name = 'StayEase Boutique Hotel',
    city = 'India',
    location,
    images = [],
    rating = 4.88,
    startingPrice = 3200,
    reviewsCount = 124
  } = hotel;

  const primaryImage = images && images.length > 0 ? images[0] : DEFAULT_HOTEL_IMG;
  const locationText = location || `${city}, India`;

  return (
    <article className="property-card" aria-labelledby={`hotel-card-title-${hotelId}`}>
      {/* 20:19 Aspect Ratio Photo Frame with Soft Curved Corners */}
      <div className="property-photo-frame">
        <Link to={`/hotels/${hotelId}`} tabIndex={-1} aria-hidden="true">
          <img
            src={primaryImage}
            alt={`${name} exterior view`}
            width="400"
            height="380"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_HOTEL_IMG;
            }}
          />
        </Link>

        {/* Floating "Guest favorite" Badge */}
        <div className="property-badge-wrap">
          <span className="badge-guest-favorite">
            Guest favorite
          </span>
        </div>

        {/* Interactive Heart Wishlist Button */}
        <button
          type="button"
          onClick={toggleLike}
          className={`property-heart-btn ${isLiked ? 'liked' : ''}`}
          aria-label={isLiked ? `Remove ${name} from saved wishlists` : `Save ${name} to wishlist`}
          aria-pressed={isLiked}
        >
          <Heart
            size={20}
            color={isLiked ? 'var(--color-primary)' : '#ffffff'}
            fill={isLiked ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.35)'}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Meta Information Beneath Photo */}
      <div className="property-meta-block">
        <div className="property-header-row">
          <h3 id={`hotel-card-title-${hotelId}`} className="property-title">
            <Link to={`/hotels/${hotelId}`} className="property-title-link">
              {name}
            </Link>
          </h3>
          <div className="property-rating" aria-label={`Rating ${Number(rating).toFixed(2)} out of 5 stars`}>
            <Star size={12} fill="var(--color-star-rating)" color="var(--color-star-rating)" aria-hidden="true" />
            <span className="tabular-nums">{Number(rating).toFixed(2)}</span>
          </div>
        </div>

        <div className="property-distance">{locationText}</div>
        <div className="property-dates">Available next weekend &bull; Free breakfast</div>

        <div className="property-price-line">
          <span className="property-price-bold tabular-nums">{formatCurrency(startingPrice)}</span>
          <span className="property-price-unit">&nbsp;/ night</span>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
