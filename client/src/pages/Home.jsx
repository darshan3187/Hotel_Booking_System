import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Marquee from '../components/Marquee';
import ReviewCard from '../components/ReviewCard';
import DecayCard from '../components/DecayCard';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';

import { POPULAR_DESTINATIONS, HOTELS_DATA } from '../data/hotelsData';





const TESTIMONIALS = [
  {
    name: 'Aisha Sharma',
    username: '@aisha_mumbai',
    city: 'Mumbai',
    role: 'Travel Photographer',
    rating: 5,
    text: 'StayEase made booking a restored palace in Jaipur completely effortless. The room photography was 100% faithful to reality.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
  },
  {
    name: 'Vikram Mehta',
    username: '@vikram_blr',
    city: 'Bangalore',
    role: 'Product Architect',
    rating: 5,
    text: 'The pricing clarity is exceptional. The exact total displayed is the exact amount billed, with zero hidden resort surprises.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
  },
  {
    name: 'Dr. Radhika Nair',
    username: '@radhika_ahd',
    city: 'Ahmedabad',
    role: 'Cultural Historian',
    rating: 5,
    text: 'The heritage haveli we reserved in old Ahmedabad was an architectural marvel with quiet courtyards and exemplary service.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'
  },
  {
    name: 'Rohan & Meera',
    username: '@rohan_delhi',
    city: 'Delhi NCR',
    role: 'Design Lead',
    rating: 5,
    text: 'From check-in to check-out, the experience felt tailored and serene. Our private villa in Goa exceeded all expectations!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
  },
  {
    name: 'Priya Deshmukh',
    username: '@priya_goa',
    city: 'Goa',
    role: 'Culinary Writer',
    rating: 5,
    text: 'Loved the curated recommendations for local dining and coastal experiences. Truly boutique hospitality at its finest.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'
  },
  {
    name: 'Kabir Verma',
    username: '@kabir_jaipur',
    city: 'Jaipur',
    role: 'Creative Director',
    rating: 5,
    text: 'The smooth booking flow and instant confirmation made planning our anniversary gateway in Rajasthan stress-free.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=80'
  }
];

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires user gesture
        });
      }
    }
  }, []);

  return (
    <main id="main-content" className="homepage-main">
      {/* 1. Hero Section with Integrated Search Bar */}
      <section className="hero-video-section" aria-label="Hero discovery banner">
        <video
          ref={videoRef}
          className="hero-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/Hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-scrim" aria-hidden="true" />

        <div className="container hero-video-content">
          <span className="hero-eyebrow">
            Boutique Hospitality Across India
          </span>
          <h1 className="hero-title">Find your next stay.</h1>
          <p className="hero-subtitle">Comfortable rooms, trusted hotels, and simple booking.</p>
          <div className="hero-search-wrapper">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* 2. Popular Destinations Grid */}
      <section className="section-py" id="destinations">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Curated Regions</span>
              <h2 className="section-heading">Popular Destinations</h2>
            </div>
            {/* <Link to="/hotels" className="btn btn-outline btn-sm">
              <span>View All</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link> */}
          </div>

          <div className="home-destinations-grid">
            {POPULAR_DESTINATIONS.map((dest, index) => (
              <Link
                key={dest.city}
                to={`/hotels?city=${dest.city}`}
                className="destination-card-link"
                aria-label={`Explore hotels in ${dest.city}`}
              >
                <DecayCard
                  image={dest.image}
                  width="100%"
                  height={400}
                  intensity={0.5}
                  sensitivity={0.5}
                  hoverDecay={0.05}
                  recovery={0.6}
                  idle={0.35}
                  grain={0.25}
                  detail={5}
                  pattern={(index % 4) + 1}
                  flow={0}
                  chroma={0}
                  travel={50}
                  tilt={10}
                  scope="card"
                  radius={0}
                  grayscale={false}
                  className="decay-destination-card"
                >
                  <h3 className="dest-city">{dest.city}</h3>
                  {dest.subtitle && <p className="dest-subtitle">{dest.subtitle}</p>}
                </DecayCard>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* 5. Customer Testimonials (Magic UI Marquee) */}
      <section className="section-py testimonials-section">
        <div className="container">
          <div className="standard-header" style={{ marginBottom: '30px' }}>
            <span className="section-eyebrow">Guest Reviews</span>
            <h2 className="section-heading">Stories From Travelers</h2>
          </div>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-fade-left" aria-hidden="true" />
          <div className="marquee-fade-right" aria-hidden="true" />
          
          {/* Row 1 */}
          <Marquee pauseOnHover duration="24s">
            {TESTIMONIALS.slice(0, 3).map((item) => (
              <ReviewCard key={item.username} {...item} />
            ))}
          </Marquee>

          {/* Row 2 (Reverse) */}
          <Marquee reverse pauseOnHover duration="28s">
            {TESTIMONIALS.slice(3, 6).map((item) => (
              <ReviewCard key={item.username} {...item} />
            ))}
          </Marquee>
        </div>
      </section>

    </main>
  );
};

export default Home;
