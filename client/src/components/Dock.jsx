import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DockContext = createContext({
  mouseX: null,
  hovered: false,
});

export const useDock = () => useContext(DockContext);

export function Dock({ children, className = '' }) {
  const mouseX = useMotionValue(Infinity);
  const [hovered, setHovered] = useState(false);

  return (
    <DockContext.Provider value={{ mouseX, hovered }}>
      <motion.nav
        className={`dock-container ${className}`}
        role="navigation"
        aria-label="Application dock"
        onMouseMove={(e) => {
          mouseX.set(e.pageX);
          setHovered(true);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
          setHovered(false);
        }}
        style={{ x: "-50%" }}
        initial={{ x: "-50%", y: 50, opacity: 0 }}
        animate={{ x: "-50%", y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
}

export function DockCard({ children, onClick, label, isActive = false, id }) {
  const cardRef = useRef(null);
  const { mouseX } = useDock();
  const [hoveredCard, setHoveredCard] = useState(false);

  // Measure distance from mouse to card center
  const distance = useTransform(mouseX, (val) => {
    const bounds = cardRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - (bounds.x + bounds.width / 2);
  });

  // Smooth magnification curve: base 46px up to 70px when cursor approaches
  const widthSync = useTransform(distance, [-130, 0, 130], [46, 70, 46]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 14 });

  return (
    <div
      className="dock-item-wrapper"
      onMouseEnter={() => setHoveredCard(true)}
      onMouseLeave={() => setHoveredCard(false)}
    >
      {/* Tooltip Label */}
      {label && hoveredCard && (
        <motion.div
          className="dock-tooltip"
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.div>
      )}

      {/* Magnified Interactive Button */}
      <motion.button
        ref={cardRef}
        type="button"
        className={`dock-card ${isActive ? 'active' : ''}`}
        onClick={onClick}
        aria-label={label}
        style={{ width, height: width }}
        whileTap={{ scale: 0.92 }}
      >
        <div className="dock-card-inner">
          {children}
        </div>
      </motion.button>

      {/* Active Route Dot */}
      {isActive && <div className="dock-active-dot" aria-hidden="true" />}
    </div>
  );
}

export function DockDivider() {
  return <div className="dock-divider" aria-hidden="true" />;
}

export default Dock;
