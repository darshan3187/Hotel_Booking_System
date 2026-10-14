import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BedDouble, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const DEFAULT_ROOM_IMG = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

const RoomCard = ({ room, hotelId }) => {
  if (!room) return null;

  const {
    _id,
    id,
    roomType = 'Deluxe Suite',
    roomNumber = '101',
    description = 'Spacious boutique suite with artisanal craftsmanship, plush bedding, and private courtyard outlook.',
    pricePerNight = 5800,
    capacity = 2,
    amenities = ['Fast Wi-Fi', 'King Bed', 'Air Conditioning', 'Ensuite Bath'],
    images = [],
    isAvailable = true
  } = room;

  const roomId = _id || id;
  const primaryImage = images && images.length > 0 ? images[0] : DEFAULT_ROOM_IMG;

  return (
    <article className="room-card-elevated" aria-labelledby={`room-title-${roomId}`}>
      {/* Left Room Image */}
      <div className="room-card-media">
        <img
          src={primaryImage}
          alt={`${roomType} Room ${roomNumber}`}
          width="320"
          height="220"
          loading="lazy"
          className="room-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ROOM_IMG;
          }}
        />
        <div className="room-badge-overlay">
          <span className="room-type-pill">{roomType}</span>
        </div>
      </div>

      {/* Right Content Column */}
      <div className="room-card-body">
        <div className="room-card-header">
          <div>
            <div className="room-meta-top">
              <span className="room-number-tag">Suite #{roomNumber}</span>
              <span className="room-dot">&bull;</span>
              <span className="room-capacity-tag">
                <Users size={13} aria-hidden="true" />
                Up to {capacity}&nbsp;{capacity === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            <h3 id={`room-title-${roomId}`} className="room-title">
              {roomType}
            </h3>
          </div>

          <div className="room-availability-status">
            {isAvailable ? (
              <span className="status-indicator-available">
                <span className="pulse-dot" aria-hidden="true"></span> Available
              </span>
            ) : (
              <span className="status-indicator-reserved">Reserved</span>
            )}
          </div>
        </div>

        <p className="room-description">
          {description}
        </p>

        {/* Feature Amenities Chips */}
        <div className="room-amenities-row">
          <span className="room-amenity-chip">
            <BedDouble size={13} aria-hidden="true" /> King Bed
          </span>
          {amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="room-amenity-chip">
              <Check size={12} color="var(--color-primary)" aria-hidden="true" /> {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="room-amenity-chip more">+{amenities.length - 3}&nbsp;more</span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="room-card-footer">
          <div className="room-price-stack">
            <div className="room-price-line">
              <span className="room-price tabular-nums">{formatCurrency(pricePerNight)}</span>
              <span className="room-per-night">&nbsp;/ night</span>
            </div>
            <span className="room-price-subtext">Includes all standard amenities & Wi-Fi</span>
          </div>

          <div className="room-action-wrap">
            {isAvailable ? (
              <Link 
                to={`/book/${roomId}`} 
                className="btn btn-primary"
                style={{ padding: '10px 22px', fontSize: '14px' }}
              >
                Reserve Suite
              </Link>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary" 
                disabled 
                aria-disabled="true"
                style={{ opacity: 0.6, cursor: 'not-allowed', padding: '10px 20px', fontSize: '14px' }}
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
