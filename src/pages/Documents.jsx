// src/pages/Documents.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { DOCUMENTS, DOCUMENTS_CONFIG } from "../constants/documentsData";

// Professional Document Icon SVG Component
const DocumentIcon = ({ color = "#C19A40", className = "" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main document body */}
    <path
      d="M12 6C12 4.89543 12.8954 4 14 4H38L52 18V58C52 59.1046 51.1046 60 50 60H14C12.8954 60 12 59.1046 12 58V6Z"
      fill="#FFFBF5"
      stroke={color}
      strokeWidth="2"
    />
    {/* Folded corner */}
    <path
      d="M38 4V16C38 17.1046 38.8954 18 40 18H52L38 4Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Document lines */}
    <line
      x1="20"
      y1="28"
      x2="44"
      y2="28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    <line
      x1="20"
      y1="36"
      x2="44"
      y2="36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
    <line
      x1="20"
      y1="44"
      x2="36"
      y2="44"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
  </svg>
);

// Document Card Component - Simple with scale animation
function DocumentCard({ document, index, onSelect, isSelected }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.12,
        y: -6,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleClick = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => onSelect(document, index),
      });
    }
    if ("vibrate" in navigator) navigator.vibrate(30);
  };

  // Entry animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: "back.out(1.4)",
        }
      );
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Document Icon */}
      <div
        ref={iconRef}
        className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 ${
          isSelected
            ? "drop-shadow-[0_8px_20px_rgba(193,154,64,0.5)]"
            : "drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        }`}
      >
        <DocumentIcon
          color={isSelected ? "#A37F2D" : isHovered ? "#C19A40" : "#B8A074"}
          className="w-full h-full"
        />
      </div>

      {/* Document Name */}
      <p
        className={`mt-3 sm:mt-4 text-center text-xs sm:text-sm md:text-base font-futura-bk transition-colors duration-300 max-w-[100px] sm:max-w-[120px] md:max-w-[140px] truncate ${
          isHovered || isSelected ? "text-[#C19A40]" : "text-[#4A4A4A]"
        }`}
        title={document.name}
      >
        {document.name}
      </p>
    </div>
  );
}

// Document Viewer Component
function DocumentViewer({
  document,
  documents,
  currentIndex,
  onClose,
  onNavigate,
}) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset zoom and pan when document changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [document?.id]);

  // Entry animation
  useEffect(() => {
    if (overlayRef.current && containerRef.current && imageRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )
        .fromTo(
          containerRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" },
          "-=0.1"
        )
        .fromTo(
          imageRef.current,
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        );
    }
  }, []);

  // Animate document switch
  const animateDocumentSwitch = useCallback(
    (direction) => {
      if (isTransitioning || !imageRef.current) return;

      setIsTransitioning(true);
      const xDirection = direction === "next" ? -100 : 100;

      const tl = gsap.timeline({
        onComplete: () => {
          onNavigate(direction);

          gsap.fromTo(
            imageRef.current,
            { x: -xDirection, opacity: 0, scale: 0.95 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: DOCUMENTS_CONFIG.animations.documentSwitch,
              ease: "power3.out",
              onComplete: () => setIsTransitioning(false),
            }
          );
        },
      });

      tl.to(imageRef.current, {
        x: xDirection,
        opacity: 0,
        scale: 0.95,
        duration: DOCUMENTS_CONFIG.animations.documentSwitch,
        ease: "power3.in",
      });
    },
    [isTransitioning, onNavigate]
  );

  // Close animation
  const handleClose = useCallback(() => {
    if (overlayRef.current && containerRef.current) {
      const tl = gsap.timeline({ onComplete: onClose });

      tl.to(containerRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power3.in",
      }).to(
        overlayRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "-=0.15"
      );
    }
  }, [onClose]);

  // Zoom functions
  const getPanLimits = (currentZoom) => {
    const maxPanPercent = (currentZoom - 1) / currentZoom;
    return maxPanPercent * 500;
  };

  const clampPan = (newPan, currentZoom) => {
    const limit = getPanLimits(currentZoom);
    return {
      x: Math.max(-limit, Math.min(limit, newPan.x)),
      y: Math.max(-limit, Math.min(limit, newPan.y)),
    };
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 5));

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.25, 1);
    setZoom(newZoom);
    if (newZoom <= 1) setPan({ x: 0, y: 0 });
    else setPan((prev) => clampPan(prev, newZoom));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse handlers for panning
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPan((prev) =>
        clampPan({ x: prev.x + deltaX, y: prev.y + deltaY }, zoom)
      );
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart, zoom]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
    const newZoom = Math.max(1, Math.min(5, zoom + zoomDelta));
    setZoom(newZoom);
    if (newZoom <= 1) setPan({ x: 0, y: 0 });
    else setPan((prev) => clampPan(prev, newZoom));
  };

  const handleImageClick = () => {
    if (zoom <= 1 && !isDragging) {
      setZoom((prev) => Math.min(prev + 0.5, 5));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowLeft") animateDocumentSwitch("prev");
      else if (e.key === "ArrowRight") animateDocumentSwitch("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, animateDocumentSwitch]);

  // Mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!document) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9000 }}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 cursor-pointer"
        style={{ zIndex: 9050 }}
      >
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation Arrows */}
      {documents.length > 1 && (
        <>
          <button
            onClick={() => animateDocumentSwitch("prev")}
            disabled={isTransitioning}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#FFFBF5]/90 hover:bg-[#FFFBF5] border-2 border-[#C19A40]/30 hover:border-[#C19A40] rounded-full flex items-center justify-center cursor-pointer group transition-all duration-300 shadow-lg disabled:opacity-50"
            style={{ zIndex: 9050 }}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#C19A40] group-hover:text-[#A37F2D] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => animateDocumentSwitch("next")}
            disabled={isTransitioning}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#FFFBF5]/90 hover:bg-[#FFFBF5] border-2 border-[#C19A40]/30 hover:border-[#C19A40] rounded-full flex items-center justify-center cursor-pointer group transition-all duration-300 shadow-lg disabled:opacity-50"
            style={{ zIndex: 9050 }}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#C19A40] group-hover:text-[#A37F2D] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Document Container */}
      <div
        ref={containerRef}
        className="relative w-[90vw] h-[80vh] sm:w-[85vw] sm:h-[85vh] md:w-[80vw] md:h-[80vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-[#C19A40]/30"
        style={{ zIndex: 9010 }}
      >
        {/* Zoom Controls */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 flex flex-col gap-1 sm:gap-2">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 hover:bg-white rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-[#C19A40] transition-colors border border-gray-200"
            title="Zoom In"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 hover:bg-white rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-[#C19A40] transition-colors border border-gray-200"
            title="Zoom Out"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 hover:bg-white rounded-full shadow-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-[#C19A40] transition-colors border border-gray-200"
            title="Reset Zoom"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Zoom Indicator */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 bg-white/90 px-2 py-1 rounded text-xs sm:text-sm text-gray-600 border border-gray-200">
          {Math.round(zoom * 100)}%
        </div>

        {/* Document Index Indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 sm:top-4 z-30 bg-[#C19A40] text-white px-3 py-1 rounded-full text-xs sm:text-sm">
          {currentIndex + 1} / {documents.length}
        </div>

        {/* Image Container */}
        <div
          ref={imageWrapperRef}
          className="w-full h-full flex items-center justify-center p-4 sm:p-8 pb-16 sm:pb-20 overflow-hidden"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          onClick={handleImageClick}
          style={{
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
        >
          <img
            ref={imageRef}
            src={document.src}
            alt={document.name}
            className="max-w-full max-h-full object-contain select-none rounded-lg shadow-lg"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />
        </div>

        {/* Document Name - Bottom Right */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 bg-[#FFFBF5]/95 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md border border-[#C19A40]/30">
          <p className="text-sm sm:text-base md:text-lg font-futura-bk text-[#C19A40] uppercase tracking-wide">
            {document.name}
          </p>
          {document.category && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
              {document.category}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Documents Page Component
export default function Documents() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Page entry animation
  useEffect(() => {
    if (pageRef.current && headerRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.4)" }
      );
    }
  }, []);

  const handleSelectDocument = (document, index) => {
    setSelectedDocument(document);
    setCurrentIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedDocument(null);
  };

  const handleNavigate = (direction) => {
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % DOCUMENTS.length;
    } else {
      newIndex = (currentIndex - 1 + DOCUMENTS.length) % DOCUMENTS.length;
    }
    setCurrentIndex(newIndex);
    setSelectedDocument(DOCUMENTS[newIndex]);
  };

  const handleClose = () => {
    if (pageRef.current) {
      gsap.to(pageRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => navigate("/home"),
      });
    } else {
      navigate("/home");
    }
  };

  return (
    <div
  ref={pageRef}
  className="min-h-screen font-futura-bk relative"
  style={{
    zIndex: 1,
    backgroundImage: "url('/slides/bg.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed", // optional: keeps bg fixed while scrolling
  }}
>
      {/* Subtle pattern overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
      />

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1D2938]/70 hover:bg-[#1D2938]/90 rounded-full transition-all duration-300 cursor-pointer shadow-lg"
        style={{ zIndex: 100 }}
      >
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Page Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1D2938] uppercase tracking-[0.2em] mb-3 sm:mb-4">
            Documents
          </h1>
          <div className="w-20 sm:w-24 md:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#C19A40] to-transparent mx-auto mb-4 sm:mb-5" />
          <p className="text-sm sm:text-base text-[#5A5A5A] max-w-md mx-auto leading-relaxed">
            Browse through our collection of important documents and files
          </p>
        </div>

        {/* Documents Grid */}
        <div
          ref={gridRef}
          className="flex flex-wrap justify-center items-start gap-8 sm:gap-10 md:gap-12 lg:gap-16 max-w-5xl mx-auto"
        >
          {DOCUMENTS.map((doc, index) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              index={index}
              onSelect={handleSelectDocument}
              isSelected={selectedDocument?.id === doc.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {DOCUMENTS.length === 0 && (
          <div className="text-center py-20">
            <DocumentIcon
              color="#C9BFB2"
              className="w-24 h-24 mx-auto mb-4 opacity-60"
            />
            <p className="text-[#7A7A7A] text-lg">No documents available</p>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          documents={DOCUMENTS}
          currentIndex={currentIndex}
          onClose={handleCloseViewer}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}