import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/preloader.css';

/**
 * Pre-calculate the 30 isometric bricks across 4 pyramid layers
 * - Layer 0 (Base): 4x4 = 16 cubes
 * - Layer 1: 3x3 = 9 cubes
 * - Layer 2: 2x2 = 4 cubes
 * - Layer 3 (Apex): 1x1 = 1 cube
 */
const BASE_TOPS = [102, 85, 69, 53];

const generatePyramidBricks = () => {
  const bricks = [];
  let globalIndex = 0;

  for (let layer = 0; layer < 4; layer++) {
    const size = 4 - layer;
    const layerBricks = [];

    for (let u = 0; u < size; u++) {
      for (let v = 0; v < size; v++) {
        const left = 160 + (u - v) * 30;
        const top = BASE_TOPS[layer] + (u + v) * 17.32;
        const zIndex = layer * 25 + (u + v) * 2 + 10;
        const diagOrder = u + v;

        layerBricks.push({
          id: `L${layer + 1}_${u}_${v}`,
          layer,
          u,
          v,
          left,
          top,
          zIndex,
          diagOrder
        });
      }
    }

    // Sort layer bricks by diagonal row (u + v), then u, to get natural build cascade
    layerBricks.sort((a, b) => a.diagOrder - b.diagOrder || a.u - b.u);

    layerBricks.forEach(brick => {
      bricks.push({
        ...brick,
        buildIndex: globalIndex++
      });
    });
  }

  return bricks;
};

const PYRAMID_BRICKS = generatePyramidBricks();

const Preloader = ({
  fullscreen = true,
  isLoading = true,
  onComplete,
  buildText = 'Building an idea',
  thinkText = 'Thinking it through',
  resetText = 'Making room again',
  showStatusText = true,
  showLoadingDots = true,
  showGroundShadow = true,
  backgroundColor,
  cubeTopFace,
  cubeLeftFace,
  cubeRightFace,
  statusTextColor,
  statusDotColor,
  className = ''
}) => {
  // Animation phase: 0 = READY, 1 = BUILD, 2 = RIPPLE/THINK, 3 = DISMANTLE
  const [phase, setPhase] = useState(0);
  const [builtCubes, setBuiltCubes] = useState(new Set());
  const [ripplingCubes, setRipplingCubes] = useState(new Set());
  const [dismantledCubes, setDismantledCubes] = useState(new Set());
  const [currentText, setCurrentText] = useState(buildText);
  const [isVisible, setIsVisible] = useState(true);

  const timerRefs = useRef([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const addTimer = (fn, delay) => {
    const timer = setTimeout(fn, delay);
    timerRefs.current.push(timer);
    return timer;
  };

  // Run the complete cycle
  useEffect(() => {
    let isCancelled = false;

    const runCycle = () => {
      if (isCancelled) return;
      clearAllTimers();

      // 1. Ready phase
      setPhase(0);
      setBuiltCubes(new Set());
      setRipplingCubes(new Set());
      setDismantledCubes(new Set());
      setCurrentText(buildText);

      // 2. Start Build phase (builds steadily over ~1.4s)
      addTimer(() => {
        if (isCancelled) return;
        setPhase(1);

        PYRAMID_BRICKS.forEach((brick) => {
          const delay = brick.buildIndex * 42; // 30 bricks * 42ms = 1260ms
          addTimer(() => {
            if (isCancelled) return;
            setBuiltCubes((prev) => new Set([...prev, brick.buildIndex]));
          }, delay);
        });

        // 3. Start Ripple / Think phase once built (~1.5s mark)
        const buildDuration = PYRAMID_BRICKS.length * 42 + 250;
        addTimer(() => {
          if (isCancelled) return;
          setPhase(2);
          setCurrentText(thinkText);

          // Wave travels diagonally from base to apex (~1.4s)
          PYRAMID_BRICKS.forEach((brick) => {
            const waveDelay = (brick.layer * 180) + (brick.diagOrder * 70);
            addTimer(() => {
              if (isCancelled) return;
              setRipplingCubes((prev) => new Set([...prev, brick.buildIndex]));

              // Wave duration per brick: 300ms
              addTimer(() => {
                if (isCancelled) return;
                setRipplingCubes((prev) => {
                  const next = new Set(prev);
                  next.delete(brick.buildIndex);
                  return next;
                });
              }, 300);
            }, waveDelay);
          });

          // 4. Start Dismantle phase (~3.0s mark)
          const rippleDuration = 3 * 180 + 6 * 70 + 400; // ~1.36s
          addTimer(() => {
            if (isCancelled) return;
            setPhase(3);
            setCurrentText(resetText);

            // Dismantle in reverse order (~1.0s)
            PYRAMID_BRICKS.forEach((brick) => {
              const reverseIndex = (PYRAMID_BRICKS.length - 1) - brick.buildIndex;
              const dismantleDelay = reverseIndex * 32; // ~960ms
              addTimer(() => {
                if (isCancelled) return;
                setDismantledCubes((prev) => new Set([...prev, brick.buildIndex]));
              }, dismantleDelay);
            });

            // 5. Loop restart
            const dismantleDuration = PYRAMID_BRICKS.length * 32 + 350;
            addTimer(() => {
              if (isCancelled) return;
              runCycle();
            }, dismantleDuration);

          }, rippleDuration);

        }, buildDuration);

      }, 80);
    };

    runCycle();

    return () => {
      isCancelled = true;
      clearAllTimers();
    };
  }, [buildText, thinkText, resetText]);

  // Gracefully handle isLoading fading
  useEffect(() => {
    if (!isLoading) {
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    } else {
      setIsVisible(true);
    }
  }, [isLoading, onComplete]);

  if (!isVisible && !isLoading) {
    return null;
  }

  // Custom styling CSS variables if provided
  const customStyles = {
    ...(backgroundColor && { '--pyramid-bg': backgroundColor }),
    ...(cubeTopFace && { '--pyramid-cube-top': cubeTopFace }),
    ...(cubeLeftFace && { '--pyramid-cube-left': cubeLeftFace }),
    ...(cubeRightFace && { '--pyramid-cube-right': cubeRightFace }),
    ...(statusTextColor && { '--pyramid-status-text': statusTextColor }),
    ...(statusDotColor && { '--pyramid-status-dot': statusDotColor }),
    opacity: !isLoading ? 0 : 1
  };

  const isShadowActive = phase === 1 || phase === 2;

  return (
    <div
      className={`pyramid-preloader-container ${fullscreen ? 'fullscreen' : 'embedded'} ${className}`}
      style={customStyles}
      role="status"
      aria-label="Thirty solid cubes build a four-level pyramid, ripple gently, and dismantle in reverse order."
    >
      <div className="pyramid-stage">
        {/* Ground Shadow */}
        {showGroundShadow && (
          <div
            className="pyramid-ground-shadow"
            style={{
              opacity: isShadowActive ? 1 : 0,
              transform: isShadowActive ? 'scale(1)' : 'scale(0.55)'
            }}
          />
        )}

        {/* 3D Bricks Scene */}
        <div className="pyramid-bricks-scene">
          {PYRAMID_BRICKS.map((brick) => {
            const isBuilt = builtCubes.has(brick.buildIndex);
            const isRippling = ripplingCubes.has(brick.buildIndex);
            const isDismantled = dismantledCubes.has(brick.buildIndex);

            // Compute transform state
            let transform = 'translateY(-28px) scale(0.65)';
            let opacity = 0;

            if (phase === 0) {
              // Ready: hidden above
              transform = 'translateY(-28px) scale(0.65)';
              opacity = 0;
            } else if (phase === 1) {
              // Building
              if (isBuilt) {
                transform = 'translateY(0px) scale(1)';
                opacity = 1;
              } else {
                transform = 'translateY(-28px) scale(0.65)';
                opacity = 0;
              }
            } else if (phase === 2) {
              // Rippling / Holding
              opacity = 1;
              if (isRippling) {
                transform = 'translateY(-8px) scale(1.04)';
              } else {
                transform = 'translateY(0px) scale(1)';
              }
            } else if (phase === 3) {
              // Dismantling
              if (isDismantled) {
                transform = 'translateY(22px) scale(0.65) rotate(3deg)';
                opacity = 0;
              } else {
                transform = 'translateY(0px) scale(1)';
                opacity = 1;
              }
            }

            return (
              <div
                key={brick.id}
                className={`pyramid-brick-slot ${isRippling ? 'rippling' : ''}`}
                style={{
                  left: `${brick.left}px`,
                  top: `${brick.top}px`,
                  zIndex: brick.zIndex,
                  opacity,
                  transform
                }}
              >
                <div className="pyramid-cube-box">
                  {/* Top diamond face */}
                  <div className="cube-face cube-face-top" />
                  {/* Left isometric face */}
                  <div className="cube-face cube-face-left" />
                  {/* Right isometric face */}
                  <div className="cube-face cube-face-right" />
                  {/* Optional Back & Bottom for 3D fullness */}
                  <div className="cube-face cube-face-back" />
                  <div className="cube-face cube-face-bottom" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Text and Animated Dots */}
        {showStatusText && (
          <div className="pyramid-status-bar">
            <span className="pyramid-status-text">{currentText}</span>
            {showLoadingDots && (
              <div className="pyramid-dots-container" aria-hidden="true">
                <span className="pyramid-dot" />
                <span className="pyramid-dot" />
                <span className="pyramid-dot" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preloader;
