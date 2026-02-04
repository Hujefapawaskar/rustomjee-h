import { useState, useRef, useEffect, useCallback } from "react";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import AnimatedPath from "./AnimatedPath";
import { usePaths } from "./PathsContext";
import { pathData } from "./PathData";

// Marker component with animation timing (for non-portfolio paths)
function PathMarker({ position, duration, isActive }) {
  const [showMarker, setShowMarker] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setShowMarker(true);
      }, duration * 1000);

      return () => {
        clearTimeout(timer);
        setShowMarker(false);
      };
    } else {
      setShowMarker(false);
    }
  }, [isActive, duration]);

  if (!showMarker) return null;

  const elevatedPosition = [
    position[0] + 5,
    position[1] + 60,
    position[2] + 5
  ];

  return (
    <Html
      position={elevatedPosition}
      center
      style={{
        pointerEvents: 'none',
      }}
    >
      <svg
        width="45"
        height="45"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 8px rgba(34, 121, 192, 0.9))',
          animation: 'markerEntrance 0.6s ease-out forwards',
        }}
      >
        <style>
          {`
            @keyframes markerEntrance {
              0% {
                opacity: 0;
                transform: scale(0) translateY(-50px);
              }
              60% {
                opacity: 1;
                transform: scale(1.15) translateY(5px);
              }
              80% {
                transform: scale(0.95) translateY(-2px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}
        </style>
        <path
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          d="M14,10a2,2,0,1,1-2-2A2.006,2.006,0,0,1,14,10Zm5.5,0c0,6.08-4.67,9.89-6.67,11.24a1.407,1.407,0,0,1-.83.26,1.459,1.459,0,0,1-.84-.26C9.16,19.89,4.5,16.09,4.5,10A7.33,7.33,0,0,1,12,2.5,7.336,7.336,0,0,1,19.5,10ZM16,10a4,4,0,1,0-4,4A4,4,0,0,0,16,10Z"
        />
        <path
          fill="#2279C0"
          d="M14,10a2,2,0,1,1-2-2A2.006,2.006,0,0,1,14,10Zm5.5,0c0,6.08-4.67,9.89-6.67,11.24a1.407,1.407,0,0,1-.83.26,1.459,1.459,0,0,1-.84-.26C9.16,19.89,4.5,16.09,4.5,10A7.33,7.33,0,0,1,12,2.5,7.336,7.336,0,0,1,19.5,10ZM16,10a4,4,0,1,0-4,4A4,4,0,0,0,16,10Z"
        />
      </svg>
    </Html>
  );
}

// Portfolio Map Marker - using callback ref for reliable DOM access
function PortfolioLocationCard({ path, isSelected, onClick, index, isVisible }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const hasAnimatedIn = useRef(false);
  const prevVisible = useRef(isVisible);
  const tweenRef = useRef(null);

  const lastPoint = path.points[path.points.length - 1];
  const position = Array.isArray(lastPoint)
    ? [lastPoint[0], lastPoint[1] + 100, lastPoint[2]]
    : [lastPoint.x, lastPoint.y + 100, lastPoint.z];

  // Callback ref - fires when element is actually in DOM
  const setCardRef = useCallback((node) => {
    if (node && !hasAnimatedIn.current) {
      cardRef.current = node;
      hasAnimatedIn.current = true;

      // Initial mount animation
      gsap.fromTo(
        node,
        {
          opacity: 0,
          y: -50,
          scale: 0.5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.12,
          ease: "back.out(1.56)",
        }
      );
    } else if (node) {
      cardRef.current = node;
    }
  }, [index]);

  // Handle visibility toggle
  useEffect(() => {
    // Skip if ref not ready or if this is the initial render
    if (!cardRef.current || !hasAnimatedIn.current) return;
    
    // Skip if visibility hasn't changed
    if (prevVisible.current === isVisible) return;
    prevVisible.current = isVisible;

    // Kill any ongoing animation
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    if (isVisible) {
      // Show animation
      tweenRef.current = gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: index * 0.08,
          ease: "back.out(1.7)",
        }
      );
    } else {
      // Hide animation
      tweenRef.current = gsap.fromTo(
        cardRef.current,
        { opacity: 1, y: 0, scale: 1 },
        {
          opacity: 0,
          y: -20,
          scale: 0.9,
          duration: 0.3,
          delay: index * 0.03,
          ease: "power2.in",
        }
      );
    }
  }, [isVisible, index]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, []);

  return (
    <Html
      position={position}
      center
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: isVisible ? 'auto' : 'none',
        userSelect: 'none',
      }}
      occlude={false}
      distanceFactor={2000}
    >
      <div
        ref={setCardRef}
        data-portfolio-card="true"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer flex flex-col items-center"
        style={{ opacity: 0 }}
      >
        <style>
          {`
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-8px);
              }
            }
            @keyframes shadowPulse {
              0%, 100% {
                transform: translateX(-50%) scale(1);
                opacity: 0.3;
              }
              50% {
                transform: translateX(-50%) scale(1.3);
                opacity: 0.15;
              }
            }
          `}
        </style>

        {/* Main Marker Container */}
        <div
          className="flex flex-col items-center transition-transform duration-300"
          style={{
            animation: isHovered ? 'float 2s ease-in-out infinite' : 'none',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {/* Card Body */}
          <div
            className={`
              bg-white rounded-lg p-2 px-3 flex items-center gap-2 transition-all duration-300
              ${isSelected 
                ? 'shadow-[0_8px_30px_rgba(34,121,192,0.4),0_0_0_2px_#2279C0]' 
                : isHovered 
                  ? 'shadow-[0_12px_35px_rgba(0,0,0,0.25)]'
                  : 'shadow-[0_6px_20px_rgba(0,0,0,0.15)]'
              }
            `}
          >
            {/* Text Content */}
            <div className="flex flex-col">
              <span className="font-futura-medium text-lg font-bold text-gray-900 whitespace-nowrap tracking-tight leading-tight">
                {path.name}
              </span>
            </div>
          </div>

          {/* Pointer Triangle */}
          <div
            className="transition-all duration-300"
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: isSelected 
                ? '10px solid #2279C0' 
                : '10px solid #ffffff',
              marginTop: '-1px',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))',
            }}
          />

          {/* Vertical Line */}
          <div
            className="w-[2px] h-6 rounded transition-all duration-300"
            style={{
              background: isSelected
                ? 'linear-gradient(to bottom, #2279C0, rgba(34, 121, 192, 0.2))'
                : 'linear-gradient(to bottom, #4A5568, rgba(74, 85, 104, 0.2))',
            }}
          />

          {/* Pin Point */}
          <div
            className={`
              w-3 h-3 rounded-full border-2 border-white transition-all duration-300
              ${isSelected 
                ? 'bg-[#2279C0] shadow-[0_0_0_2px_rgba(34,121,192,0.3),0_4px_10px_rgba(34,121,192,0.4)]'
                : 'bg-[#4A5568] shadow-[0_0_0_2px_rgba(74,85,104,0.2),0_3px_8px_rgba(0,0,0,0.2)]'
              }
            `}
          />

          {/* Ground Shadow */}
          <div
            className="absolute left-1/2 w-10 h-2 rounded-full"
            style={{
              bottom: '-10px',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.25) 0%, transparent 70%)',
              animation: isSelected ? 'shadowPulse 2s ease-in-out infinite' : 'none',
            }}
          />
        </div>
      </div>
    </Html>
  );
}

// Portfolio Cards
function PortfolioCards({ isVisible }) {
  const { selectedPath, setSelectedPath, selectedCategory, setSelectedCategory } = usePaths();
  const portfolioData = pathData.portfolio || [];

  const handleCardClick = (pathName) => {
    setSelectedCategory("portfolio");
    setSelectedPath(pathName);
  };

  return (
    <>
      {portfolioData.map((path, index) => (
        <PortfolioLocationCard
          key={path.name || index}
          path={path}
          index={index}
          isSelected={selectedCategory === "portfolio" && selectedPath === path.name}
          onClick={() => handleCardClick(path.name)}
          isVisible={isVisible}
        />
      ))}
    </>
  );
}

export default function AllPaths() {
  const { selectedPath, selectedCategory } = usePaths();

  // Safety check
  const selected = Array.isArray(pathData[selectedCategory]) ? pathData[selectedCategory] : [];
  
  // Don't render path animations for portfolio
  const shouldRenderPaths = selectedCategory && selectedCategory !== "portfolio";
  
  // Show portfolio cards when:
  // - No category selected (null) = default state
  // - Portfolio category is selected
  // Hide when other categories are selected (historical, education, work, etc.)
  const shouldShowPortfolioCards = selectedCategory === null || selectedCategory === "portfolio";
  
  const filteredPath = selectedPath 
    ? selected.filter((item) => selectedPath === item.name) 
    : selected;

  const pathDuration = 4;
  const isCategoryActive = selected.length > 0;

  return (
    <>
      {/* Portfolio cards - visibility controlled by GSAP */}
      <PortfolioCards isVisible={shouldShowPortfolioCards} />

      {/* Path animations for non-portfolio categories */}
      {shouldRenderPaths && filteredPath.map((path, i) => {
        const lastPoint = path.points[path.points.length - 1];
        const endPosition = Array.isArray(lastPoint)
          ? lastPoint
          : [lastPoint.x, lastPoint.y, lastPoint.z];

        const isActive = selectedPath 
          ? selectedPath === path.name 
          : isCategoryActive;

        return (
          <group key={path.name || i}>
            <AnimatedPath
              name={path.name}
              points={path.points}
              color="#2279C0"
              duration={pathDuration}
              glowIntensity={3.0}
              pulseSpeed={3.0}
              tubeRadius={5}
              packetSpeed={1}
              packetCount={3}
              packetWidth={0.15}
            />

            {lastPoint && (
              <PathMarker
                position={endPosition}
                duration={pathDuration}
                isActive={isActive}
              />
            )}
          </group>
        );
      })}
    </>
  );
}