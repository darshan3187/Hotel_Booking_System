import React from 'react';
import { Star } from 'lucide-react';
import '../styles/marquee.css';

export function ReviewCard({ 
  avatar, 
  name, 
  username, 
  city, 
  role, 
  rating = 5, 
  text, 
  body, 
  img, 
  className = '',
  isDark = false 
}) {
  const reviewText = text || body;
  const avatarImg = avatar || img || `https://avatar.vercel.sh/${username || name}`;
  
  return (
    <figure className={`marquee-review-card ${isDark ? 'dark-card' : ''} ${className}`}>
      <div className="review-card-header">
        <img
          src={avatarImg}
          alt={name}
          className="review-card-avatar"
          loading="lazy"
        />
        <div className="review-card-user-info">
          <figcaption className="review-card-name">{name}</figcaption>
          <p className="review-card-username">
            {username} {city ? `• ${city}` : role ? `• ${role}` : ''}
          </p>
        </div>
        <div className="review-card-stars" aria-label={`Rating: ${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={13} fill="#ff385c" color="#ff385c" />
          ))}
        </div>
      </div>
      <blockquote className="review-card-body">"{reviewText}"</blockquote>
    </figure>
  );
}

export default ReviewCard;
