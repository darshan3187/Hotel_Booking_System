import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  ChevronDown, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDate, formatDateForInput } from '../utils/formatters';
import { POPULAR_DESTINATIONS } from '../data/hotelsData';

const SearchBar = ({ initialCity = '', initialCheckIn = '', initialCheckOut = '', initialGuests = 2 }) => {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const cityInputRef = useRef(null);

  // Setup default dates if empty
  const today = new Date();
  const defaultIn = new Date();
  defaultIn.setDate(today.getDate() + 1);
  const defaultOut = new Date();
  defaultOut.setDate(today.getDate() + 3);

  const [city, setCity] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn || formatDateForInput(defaultIn));
  const [checkOut, setCheckOut] = useState(initialCheckOut || formatDateForInput(defaultOut));

  // Guest state: Adults, Children, Rooms
  const [adults, setAdults] = useState(Math.max(1, initialGuests));
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Active section ('where' | 'checkin' | 'checkout' | 'who' | null)
  const [activeSection, setActiveSection] = useState(null);

  // Calendar month navigation state
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = checkIn ? new Date(checkIn) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Close popovers on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setActiveSection(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveSection(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Form Submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setActiveSection(null);

    const totalGuests = adults + children;
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (totalGuests) params.append('guests', totalGuests);

    navigate(`/hotels?${params.toString()}`);
  };

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setActiveSection('checkin');
  };

  // Helper for guest summary string
  const totalGuests = adults + children;
  const guestSummary = `${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'} · ${rooms} ${rooms === 1 ? 'room' : 'rooms'}`;

  // Helper for calendar rendering
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (dateStr) => {
    if (activeSection === 'checkin') {
      setCheckIn(dateStr);
      if (checkOut <= dateStr) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOut(formatDateForInput(nextDay));
      }
      setActiveSection('checkout');
    } else if (activeSection === 'checkout') {
      if (dateStr > checkIn) {
        setCheckOut(dateStr);
        setActiveSection('who');
      }
    }
  };

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  return (
    <div className="booking-search-container" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="booking-search-pill" role="search" aria-label="Hotel Search">
        
        {/* SECTION 1: WHERE */}
        <div 
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={activeSection === 'where'}
          aria-label="Destination location selector"
          className={`booking-section where-section ${activeSection === 'where' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveSection('where');
            setTimeout(() => cityInputRef.current?.focus(), 50);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveSection('where');
              setTimeout(() => cityInputRef.current?.focus(), 50);
            }
          }}
        >
          <div className="section-icon-box">
            <MapPin size={18} aria-hidden="true" />
          </div>
          <div className="section-text-stack">
            <div className="section-value-row">
              <input
                ref={cityInputRef}
                type="text"
                className="section-input"
                placeholder="Search destination"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (activeSection !== 'where') setActiveSection('where');
                }}
                onFocus={() => setActiveSection('where')}
                aria-label="Search destination"
                autoComplete="off"
                spellCheck={false}
              />
              {city && (
                <button
                  type="button"
                  className="section-clear-btn"
                  aria-label="Clear destination"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCity('');
                    cityInputRef.current?.focus();
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* WHERE POPOVER */}
          {activeSection === 'where' && (
            <div 
              className="booking-popover where-popover" 
              onClick={(e) => e.stopPropagation()} 
              role="dialog"
              aria-label="Destination options"
            >
              <div className="mobile-popover-handle" aria-hidden="true" />
              <div className="popover-heading">Where are you going?</div>
              <div className="searchbar-destinations-list">
                {POPULAR_DESTINATIONS
                  .filter(item => !city || item.city.toLowerCase().includes(city.toLowerCase()) || item.region.toLowerCase().includes(city.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.city}
                      type="button"
                      className="destination-item-btn"
                      onClick={() => handleSelectCity(item.city)}
                    >
                      <div className="dest-icon-box">
                        <MapPin size={16} />
                      </div>
                      <div className="dest-text-box">
                        <span className="dest-city-name">{item.city}</span>
                        <span className="dest-desc">{item.desc}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="booking-divider" aria-hidden="true" />

        {/* SECTION 2: CHECK IN */}
        <div 
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={activeSection === 'checkin'}
          aria-label="Check-in date selector"
          className={`booking-section date-section ${activeSection === 'checkin' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('checkin')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveSection('checkin');
            }
          }}
        >
          <div className="section-icon-box">
            <CalendarIcon size={18} aria-hidden="true" />
          </div>
          <div className="section-text-stack">
            <span className="section-label">Check in</span>
            <div className="section-value-row">
              <span className="section-value-text">
                {checkIn ? formatDate(checkIn) : 'Add date'}
              </span>
            </div>
          </div>

          {/* CHECK IN POPOVER */}
          {activeSection === 'checkin' && (
            <div 
              className="booking-popover calendar-popover" 
              onClick={(e) => e.stopPropagation()} 
              role="dialog"
              aria-label="Check-in calendar"
            >
              <div className="mobile-popover-handle" aria-hidden="true" />
              <div className="calendar-header">
                <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
                  <ChevronLeft size={18} />
                </button>
                <div className="cal-month-title">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="calendar-weekdays">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="calendar-days-grid">
                {Array.from({ length: firstDayOfWeek(calendarMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="cal-day-empty" />
                ))}

                {Array.from({ length: daysInMonth(calendarMonth) }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNum);
                  const dateStr = formatDateForInput(dateObj);
                  const isTodayStr = formatDateForInput(new Date()) === dateStr;
                  const isDisabled = dateStr < formatDateForInput(new Date());
                  const isSelected = dateStr === checkIn;
                  const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isDisabled}
                      className={`cal-day-btn ${isSelected ? 'is-selected' : ''} ${isInRange ? 'is-in-range' : ''} ${isTodayStr ? 'is-today' : ''}`}
                      onClick={() => handleDateClick(dateStr)}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
              <div className="calendar-footer-hint">Select your check-in date</div>
            </div>
          )}
        </div>

        <div className="booking-divider" aria-hidden="true" />

        {/* SECTION 3: CHECK OUT */}
        <div 
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={activeSection === 'checkout'}
          aria-label="Check-out date selector"
          className={`booking-section date-section ${activeSection === 'checkout' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('checkout')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveSection('checkout');
            }
          }}
        >
          <div className="section-icon-box">
            <CalendarIcon size={18} aria-hidden="true" />
          </div>
          <div className="section-text-stack">
            <span className="section-label">Check out</span>
            <div className="section-value-row">
              <span className="section-value-text">
                {checkOut ? formatDate(checkOut) : 'Add date'}
              </span>
            </div>
          </div>

          {/* CHECK OUT POPOVER */}
          {activeSection === 'checkout' && (
            <div 
              className="booking-popover calendar-popover checkout-popover" 
              onClick={(e) => e.stopPropagation()} 
              role="dialog"
              aria-label="Check-out calendar"
            >
              <div className="mobile-popover-handle" aria-hidden="true" />
              <div className="calendar-header">
                <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
                  <ChevronLeft size={18} />
                </button>
                <div className="cal-month-title">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="calendar-weekdays">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="calendar-days-grid">
                {Array.from({ length: firstDayOfWeek(calendarMonth) }).map((_, i) => (
                  <div key={`empty-out-${i}`} className="cal-day-empty" />
                ))}

                {Array.from({ length: daysInMonth(calendarMonth) }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNum);
                  const dateStr = formatDateForInput(dateObj);
                  const isTodayStr = formatDateForInput(new Date()) === dateStr;
                  const isDisabled = dateStr <= (checkIn || formatDateForInput(new Date()));
                  const isSelected = dateStr === checkOut;
                  const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isDisabled}
                      className={`cal-day-btn ${isSelected ? 'is-selected' : ''} ${isInRange ? 'is-in-range' : ''} ${isTodayStr ? 'is-today' : ''}`}
                      onClick={() => handleDateClick(dateStr)}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
              <div className="calendar-footer-hint">Select your check-out date</div>
            </div>
          )}
        </div>

        <div className="booking-divider" aria-hidden="true" />

        {/* SECTION 4: WHO / GUESTS */}
        <div 
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={activeSection === 'who'}
          aria-label="Guests and rooms selector"
          className={`booking-section who-section ${activeSection === 'who' ? 'is-active' : ''}`}
          onClick={() => setActiveSection('who')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveSection('who');
            }
          }}
        >
          <div className="section-icon-box">
            <Users size={18} aria-hidden="true" />
          </div>
          <div className="section-text-stack">
            <span className="section-label">Guests</span>
            <div className="section-value-row">
              <span className="section-value-text">{guestSummary}</span>
              <ChevronDown size={14} className="section-chevron" aria-hidden="true" />
            </div>
          </div>

          {/* GUESTS POPOVER */}
          {activeSection === 'who' && (
            <div 
              className="booking-popover guests-popover" 
              onClick={(e) => e.stopPropagation()} 
              role="dialog"
              aria-label="Guest options"
            >
              <div className="mobile-popover-handle" aria-hidden="true" />
              {/* Adults Row */}
              <div className="guest-control-row">
                <div className="guest-label-group">
                  <span className="guest-type">Adults</span>
                  <span className="guest-sub">13+ years</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    className="counter-btn"
                    aria-label="Decrease adults"
                    disabled={adults <= 1}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    -
                  </button>
                  <span className="counter-value">{adults}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    aria-label="Increase adults"
                    disabled={adults >= 10}
                    onClick={() => setAdults(Math.min(10, adults + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Row */}
              <div className="guest-control-row">
                <div className="guest-label-group">
                  <span className="guest-type">Children</span>
                  <span className="guest-sub">2–12 years</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    className="counter-btn"
                    aria-label="Decrease children"
                    disabled={children <= 0}
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    -
                  </button>
                  <span className="counter-value">{children}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    aria-label="Increase children"
                    disabled={children >= 6}
                    onClick={() => setChildren(Math.min(6, children + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rooms Row */}
              <div className="guest-control-row">
                <div className="guest-label-group">
                  <span className="guest-type">Rooms</span>
                  <span className="guest-sub">Required rooms</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    className="counter-btn"
                    aria-label="Decrease rooms"
                    disabled={rooms <= 1}
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                  >
                    -
                  </button>
                  <span className="counter-value">{rooms}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    aria-label="Increase rooms"
                    disabled={rooms >= 5}
                    onClick={() => setRooms(Math.min(5, rooms + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH BUTTON CTA */}
        <button 
          type="submit" 
          className="booking-search-cta" 
          aria-label="Search available stays"
        >
          <Search size={18} strokeWidth={2.4} aria-hidden="true" />
          <span className="cta-label">Search</span>
        </button>

      </form>
    </div>
  );
};

export default SearchBar;
