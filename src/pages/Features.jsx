// Features.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { type1SlidesData } from "../constants/featuresData";
import Loader from "../components/Loader";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1",
);

// ============================================
// BREAKPOINT REFERENCE (update your tailwind config)
// ============================================
// sm: 640px    - Large phones landscape
// md: 768px    - Small tablets landscape
// lg: 1024px   - iPad Pro & tablets landscape
// xl: 1280px   - Small laptops / large tablets
// 2xl: 1536px  - Your 1080p GOLDEN STANDARD (1920x1080)
// 3xl: 2560px  - 2K monitors
// 4xl: 3840px  - 4K monitors
// ============================================

// ============================================
// CUSTOM HOOK: useImageTopAlignment
// Calculates and returns the top position of an image/container
// ============================================
const useImageTopAlignment = (imageRef, containerRef, options = {}) => {
  const { 
    defaultTopPercent = 15, // Default position as percentage
    minTopPx = 16, // Minimum distance from top in pixels
    enabled = true 
  } = options;
  
  const [topPosition, setTopPosition] = useState(`${defaultTopPercent}%`);

  const calculatePosition = useCallback(() => {
    if (!enabled || !imageRef?.current || !containerRef?.current) {
      return;
    }

    const imageRect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate the top of the image relative to the container
    let topOffset = imageRect.top - containerRect.top;
    
    // Ensure minimum distance from top
    topOffset = Math.max(topOffset, minTopPx);
    
    setTopPosition(`${topOffset}px`);
  }, [enabled, minTopPx]);

  useEffect(() => {
    if (!enabled) return;

    // Initial calculation after a short delay to ensure images are rendered
    const initialTimeout = setTimeout(calculatePosition, 100);
    
    // Recalculate on resize
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleResize);
    
    // Also recalculate when images load
    const img = imageRef?.current;
    if (img && img.tagName === 'IMG') {
      img.addEventListener('load', calculatePosition);
    }

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', handleResize);
      if (img && img.tagName === 'IMG') {
        img.removeEventListener('load', calculatePosition);
      }
    };
  }, [calculatePosition, enabled]);

  return topPosition;
};

// ============================================
// CUSTOM HOOK: useContainerTopAlignment
// For aligning with a container/div top (like portfolio slide)
// ============================================
const useContainerTopAlignment = (targetRef, containerRef, options = {}) => {
  const { 
    defaultTopPercent = 15,
    minTopPx = 16,
    enabled = true 
  } = options;
  
  const [topPosition, setTopPosition] = useState(`${defaultTopPercent}%`);

  const calculatePosition = useCallback(() => {
    if (!enabled || !targetRef?.current || !containerRef?.current) {
      return;
    }

    const targetRect = targetRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate the top of the target element relative to the container
    let topOffset = targetRect.top - containerRect.top;
    
    // Ensure minimum distance from top
    topOffset = Math.max(topOffset, minTopPx);
    
    setTopPosition(`${topOffset}px`);
  }, [enabled, minTopPx]);

  useEffect(() => {
    if (!enabled) return;

    const initialTimeout = setTimeout(calculatePosition, 50);
    
    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculatePosition, enabled]);

  return topPosition;
};

// ============================================
// CLOSE BUTTON COMPONENT
// ============================================
const CloseButton = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <button
      onClick={handleClose}
      className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-50 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group"
      aria-label="Close and return to home"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

// ============================================
// ACCENT SQUARES COMPONENT (Reusable)
// ============================================
const AccentSquares = ({ accentSquares, seaBoxSrc, squaresPosition }) => {
  if (!accentSquares) return null;

  const isLeft = squaresPosition === "left";

  return (
    <div
      className={`flex ${isLeft ? "justify-start" : "justify-end"} gap-0.5 sm:gap-1`}
    >
      {isLeft ? (
        <>
          {accentSquares.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-14 4xl:h-14 text-element"
              style={{ backgroundColor: color }}
            />
          ))}
          {seaBoxSrc && (
            <img
              src={seaBoxSrc}
              alt=""
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-14 4xl:h-14 object-cover text-element"
            />
          )}
        </>
      ) : (
        <>
          {seaBoxSrc && (
            <img
              src={seaBoxSrc}
              alt=""
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-14 4xl:h-14 object-cover text-element"
            />
          )}
          {accentSquares.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 4xl:w-14 4xl:h-14 text-element"
              style={{ backgroundColor: color }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// ============================================
// HELPER: Render paragraphs with exact line breaks
// ============================================
const renderParagraphs = (
  paragraphs,
  alignment = "right",
  textSizeClass = "text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] xl:text-[10px] 2xl:text-[14px] 3xl:text-[18px] 4xl:text-[24px]",
) => {
  if (!paragraphs) return null;

  return paragraphs.map((paragraph, pIndex) => (
    <div key={pIndex} className="text-element">
      {paragraph.lines ? (
        paragraph.lines.map((line, lIndex) => (
          <p
            key={lIndex}
            className={`text-black ${textSizeClass} font-futura-bk leading-relaxed text-${alignment}`}
          >
            {line}
          </p>
        ))
      ) : (
        <p
          className={`text-black ${textSizeClass} font-futura-bk leading-relaxed text-${alignment}`}
        >
          {paragraph}
        </p>
      )}
    </div>
  ));
};

// ============================================
// SLIDE TYPE: splitBackground (Slide 1)
// ============================================
const SplitBackgroundSlide = ({ data }) => {
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);
  
  const paragraphTop = useContainerTopAlignment(imageContainerRef, containerRef, {
    defaultTopPercent: 25,
    minTopPx: 16,
  });

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Single Background covering entire slide */}
      <img
        src={data.rightSection.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      {/* Content Layer */}
      <div className="absolute inset-0 flex">
        {/* Left Section - Image (vertically centered) */}
        <div className="w-[38%] sm:w-[38%] md:w-[40%] lg:w-[42%] xl:w-[40%] 2xl:w-[35%] 3xl:w-[35%] 4xl:w-[35%] relative h-full flex items-center justify-start">
          {/* Person Image with hover effect */}
          <div 
            ref={imageContainerRef}
            className="h-[50%] sm:h-[52%] md:h-[55%] lg:h-[55%] xl:h-[52%] 2xl:h-[50%] 3xl:h-[50%] 4xl:h-[50%] w-full overflow-hidden group"
          >
            <img
              src={data.leftSection.imageSrc}
              className="w-full h-full object-cover object-[50%_30%] text-element transition-all duration-700 ease-out"
              alt=""
            />
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </div>

        {/* Right Section - Text Content */}
        <div className="w-[62%] sm:w-[62%] md:w-[60%] lg:w-[58%] xl:w-[60%] 2xl:w-[60%] 3xl:w-[60%] 4xl:w-[60%] absolute h-full right-0">
          {/* Content Container - Right aligned text */}
          <div className="h-full px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-14 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-28 4xl:py-28 flex flex-col justify-between relative">
            {/* Middle Section - Paragraphs aligned with image top */}
            <div 
              className="absolute right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-14 3xl:right-20 4xl:right-28"
              style={{ top: paragraphTop }}
            >
              <div className="text-right space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-7 3xl:space-y-9 4xl:space-y-12">
                {renderParagraphs(
                  data.rightSection.paragraphs,
                  "right",
                  "text-[5px] sm:text-[6px] md:text-[7px] lg:text-[10px] xl:text-[12px] 2xl:text-lg 3xl:text-2xl 4xl:text-4xl",
                )}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Bottom Section - Signature Area */}
            <div className="text-right">
              <div className="bottom-right"></div>
              {data.rightSection.signature && (
                <div className="mb-1 sm:mb-1.5 md:mb-2 lg:mb-2.5 xl:mb-3 2xl:mb-4 3xl:mb-5 4xl:mb-6 ">
                  {/* Optional: Signature Image */}
                  {data.rightSection.signature.signatureImageSrc && (
                    <img
                      src={data.rightSection.signature.signatureImageSrc}
                      alt="Signature"
                      className="h-4 sm:h-4 md:h-5 lg:h-5 xl:h-5 2xl:h-6 3xl:h-8 4xl:h-12 ml-auto mb-1 text-element"
                    />
                  )}
                  {/* Signature Name */}
                  <p className="text-black text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-lg font-futura-bk tracking-tight font-bold opacity-70 mt-0.5 sm:mt-1 whitespace-pre-line text-element">
                    {data.rightSection.topSubtext}
                  </p>
                </div>
              )}

              {/* Accent Squares with seaBox */}
              <div className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2.5 xl:mt-3 2xl:mt-4 3xl:mt-5 4xl:mt-6">
                <AccentSquares
                  accentSquares={data.rightSection.accentSquares}
                  seaBoxSrc={data.rightSection.seaBoxSrc}
                  squaresPosition={data.rightSection.squaresPosition}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: threeArchitects (Slide 2)
// UPDATED: Heading aligned with image container top
// ============================================
const ThreeArchitectsSlide = ({ data }) => {
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);
  
  const headingTop = useContainerTopAlignment(imageContainerRef, containerRef, {
    defaultTopPercent: 12,
    minTopPx: 16,
  });

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex justify-between">
        {/* Left Section - Title and Accent Squares */}
        <div className="w-[25%] sm:w-[26%] md:w-[28%] lg:w-[30%] xl:w-[32%] 2xl:w-[35%] 3xl:w-[35%] 4xl:w-[35%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-14 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-28 4xl:py-28 flex flex-col justify-between h-full relative">
          {/* Title - dynamically positioned */}
          <div>
            <h2 
              className="absolute text-black text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl font-futura-bk uppercase tracking-wide whitespace-pre-line leading-tight text-element"
              style={{ top: headingTop }}
            >
              {data.title}
            </h2>
          </div>

          {/* Accent Squares at bottom left */}
          <AccentSquares
            accentSquares={data.accentSquares}
            seaBoxSrc={data.seaBoxSrc}
            squaresPosition={data.squaresPosition}
          />
        </div>

        {/* Right Section - 3 Architect Cards */}
        <div className="w-[75%] sm:w-[74%] md:w-[72%] lg:w-[70%] xl:w-[68%] 2xl:w-[60%] 3xl:w-[50%] 4xl:w-[50%] flex items-center justify-between py-3 sm:py-4 md:py-5 lg:py-6 xl:py-8 2xl:py-12 3xl:py-16 4xl:py-20 pr-3 sm:pr-4 md:pr-5 lg:pr-6 xl:pr-8 2xl:pr-14 3xl:pr-20 4xl:pr-28">
          <div 
            ref={imageContainerRef}
            className="flex gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-10 w-full items-start"
          >
            {data.architects.map((architect, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col group cursor-pointer"
              >
                {/* Photo */}
                <div className="w-full h-28 sm:h-32 md:h-40 lg:h-48 xl:h-60 2xl:h-110 3xl:h-[30rem] 4xl:h-[40rem] overflow-hidden relative flex-shrink-0">
                  <img
                    src={architect.src}
                    className="w-full h-full object-cover object-[50%_0%] text-element transition-all duration-700 ease-out"
                    alt={architect.name}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>

                {/* Name - INCREASED SIZE */}
                <p className="text-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[11px] xl:text-sm 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl uppercase font-futura-bk tracking-widest mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 xl:mt-3.5 2xl:mt-4 3xl:mt-5 4xl:mt-6 text-center transition-all duration-300 group-hover:tracking-wider text-element">
                  {architect.name}
                </p>

                {/* Title - INCREASED SIZE */}
                <p className="text-black text-[5px] sm:text-[5.5px] md:text-[6.5px] lg:text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-lg uppercase font-futura-bk opacity-60 mt-0.5 text-center tracking-wider text-element">
                  {architect.title}
                </p>

                {/* Description - INCREASED SIZE */}
                {architect.description && (
                  <p className="text-black text-[5px] sm:text-[5.5px] md:text-[6px] lg:text-[10px] xl:text-[14px] 2xl:text-[19px] 3xl:text-[23px] 4xl:text-[34px] font-futura-bk leading-relaxed lg:leading-loose mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 xl:mt-3.5 2xl:mt-4 3xl:mt-5 4xl:mt-6 text-justify tracking-tight text-element">
                    {architect.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: architectIndividual (Slides 3, 4, 5)
// UPDATED: Heading aligned with image top
// ============================================
const ArchitectIndividualSlide = ({ data }) => {
  const isImageLeft = data.layoutDirection === "imageLeft";
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const paragraphRef = useRef(null);
  const [paragraphBottom, setParagraphBottom] = useState('auto');
  
  const headingTop = useImageTopAlignment(imageRef, containerRef, {
    defaultTopPercent: 18,
    minTopPx: 16,
  });

  // Calculate paragraph position so its bottom aligns with image bottom
  useEffect(() => {
    const calculateParagraphPosition = () => {
      if (!imageRef.current || !containerRef.current) return;
      
      const imageRect = imageRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Get the bottom of the image relative to the container
      const imageBottom = imageRect.bottom - containerRect.top;
      
      // Calculate from the bottom of the container
      const containerHeight = containerRect.height;
      const bottomOffset = containerHeight - imageBottom;
      
      setParagraphBottom(`${bottomOffset}px`);
    };

    calculateParagraphPosition();
    
    // Small delay to ensure image is rendered
    const timeout = setTimeout(calculateParagraphPosition, 100);
    
    window.addEventListener('resize', calculateParagraphPosition);
    
    // Recalculate when image loads
    const img = imageRef.current;
    if (img) {
      img.addEventListener('load', calculateParagraphPosition);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateParagraphPosition);
      if (img) {
        img.removeEventListener('load', calculateParagraphPosition);
      }
    };
  }, []);

  // Render paragraphs as continuous text block with line breaks
  const renderArchitectParagraphs = (paragraphs, alignment) => {
    if (!paragraphs) return null;

    const textAlignClass = alignment === "left" ? "text-left" : "text-right";

    return (
      <div className={`${textAlignClass}`}>
        {paragraphs.map((paragraph, pIndex) => (
          <div key={pIndex} className="text-element">
            {paragraph.lines &&
              paragraph.lines.map((line, lIndex) => (
                <p
                  key={lIndex}
                  className={`text-black text-[5px] sm:text-[6px] md:text-[7px] lg:text-[10px] xl:text-[12px] 2xl:text-[17px] 3xl:text-[22.5px] 4xl:text-[34px] font-futura-bk leading-[1.6] sm:leading-[1.6] md:leading-[1.65] lg:leading-[1.7] xl:leading-[1.75] 2xl:leading-[1.8] ${textAlignClass}`}
                >
                  {line}
                </p>
              ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {isImageLeft ? (
          <>
            {/* Left - Image */}
            <div className="w-[42%] sm:w-[44%] md:w-[46%] lg:w-[48%] xl:w-[50%] 2xl:w-[55%] 3xl:w-[55%] 4xl:w-[55%] relative h-full overflow-hidden group cursor-pointer flex items-center">
              <img
                ref={imageRef}
                src={data.imageSrc}
                className="w-full h-auto object-cover text-element transition-all duration-700 ease-out"
                alt=""
              />
              <div className="absolute inset-0 bg-black/0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
            {/* Right - Text */}
            <div className="w-[58%] sm:w-[56%] md:w-[54%] lg:w-[52%] xl:w-[50%] 2xl:w-[45%] 3xl:w-[45%] 4xl:w-[45%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-10 2xl:py-16 3xl:px-14 3xl:py-20 4xl:px-20 4xl:py-28 h-full relative flex flex-col">
              {/* Top - Name and Title - dynamically positioned */}
              <div 
                className="text-right absolute right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-10 3xl:right-14 4xl:right-20"
                style={{ top: headingTop }}
              >
                <h2 className="text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl 3xl:text-3xl 4xl:text-4xl font-futura-bk uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-element">
                  {data.name}
                </h2>
                <p className="text-black text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] xl:text-[9px] 2xl:text-[14px] 3xl:text-sm 4xl:text-lg 2xl:pr-0.5 font-futura-bk uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-60 mt-0.5 sm:mt-1 text-element">
                  {data.title}
                </p>
              </div>

              {/* Bottom - Paragraphs - dynamically positioned */}
              <div 
                ref={paragraphRef}
                className="absolute right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-10 3xl:right-14 4xl:right-20 left-3 sm:left-4 md:left-5 lg:left-6 xl:left-8 2xl:left-10 3xl:left-14 4xl:left-20"
                style={{ bottom: paragraphBottom }}
              >
                {renderArchitectParagraphs(data.paragraphs, "right")}
              </div>

              {/* Bottom - Accent Squares */}
              <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 xl:bottom-10 2xl:bottom-16 3xl:bottom-20 4xl:bottom-28 right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-10 3xl:right-14 4xl:right-20">
                <AccentSquares
                  accentSquares={data.accentSquares}
                  seaBoxSrc={data.seaBoxSrc}
                  squaresPosition={data.squaresPosition}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left - Text */}
            <div className="w-[58%] sm:w-[56%] md:w-[54%] lg:w-[52%] xl:w-[50%] 2xl:w-[45%] 3xl:w-[45%] 4xl:w-[45%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-10 2xl:py-16 3xl:px-14 3xl:py-20 4xl:px-20 4xl:py-28 h-full relative flex flex-col">
              {/* Top - Name and Title - dynamically positioned */}
              <div 
                className="text-left absolute left-3 sm:left-4 md:left-5 lg:left-6 xl:left-8 2xl:left-10 3xl:left-14 4xl:left-20"
                style={{ top: headingTop }}
              >
                <h2 className="text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl 3xl:text-3xl 4xl:text-4xl font-futura-bk uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-widest text-element">
                  {data.name}
                </h2>
                <p className="text-black text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] xl:text-[9px] 2xl:text-[14px] 3xl:text-sm 4xl:text-lg font-futura-bk uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-60 mt-0.5 sm:mt-1 text-element">
                  {data.title}
                </p>
              </div>

              {/* Bottom - Paragraphs - dynamically positioned */}
              <div 
                ref={paragraphRef}
                className="absolute left-3 sm:left-4 md:left-5 lg:left-6 xl:left-8 2xl:left-10 3xl:left-14 4xl:left-20 right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-10 3xl:right-14 4xl:right-20"
                style={{ bottom: paragraphBottom }}
              >
                {renderArchitectParagraphs(data.paragraphs, "left")}
              </div>

              {/* Bottom - Accent Squares */}
              <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 xl:bottom-10 2xl:bottom-16 3xl:bottom-20 4xl:bottom-28 left-3 sm:left-4 md:left-5 lg:left-6 xl:left-8 2xl:left-10 3xl:left-14 4xl:left-20">
                <AccentSquares
                  accentSquares={data.accentSquares}
                  seaBoxSrc={data.seaBoxSrc}
                  squaresPosition={data.squaresPosition}
                />
              </div>
            </div>
            {/* Right - Image */}
            <div className="w-[42%] sm:w-[44%] md:w-[46%] lg:w-[48%] xl:w-[50%] 2xl:w-[55%] 3xl:w-[55%] 4xl:w-[55%] relative h-full overflow-hidden group cursor-pointer flex items-center">
              <img
                ref={imageRef}
                src={data.imageSrc}
                className="w-full h-auto object-cover object-[20%_0%] text-element transition-all duration-700 ease-out"
                alt=""
              />
              <div className="absolute inset-0 bg-black/0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: buildingShowcase (Slide 6)
// UPDATED: Heading aligned with image top
// ============================================
const BuildingShowcaseSlide = ({ data }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  const headingTop = useImageTopAlignment(imageRef, containerRef, {
    defaultTopPercent: 15,
    minTopPx: 16,
  });

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Background for entire slide */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left - Title and Squares */}
        <div className="w-[40%] sm:w-[40%] md:w-[38%] lg:w-[37%] xl:w-[36%] 2xl:w-[35%] 3xl:w-[35%] 4xl:w-[35%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-14 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-28 4xl:py-28 flex flex-col justify-between h-full relative">
          {/* Title - dynamically positioned */}
          <div className="text-left">
            <h2 
              className="absolute text-black text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-lg 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl font-futura-bk uppercase tracking-widest whitespace-pre-line leading-tight text-element"
              style={{ top: headingTop }}
            >
              {data.title}
            </h2>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Accent Squares at bottom left */}
          <AccentSquares
            accentSquares={data.accentSquares}
            seaBoxSrc={data.seaBoxSrc}
            squaresPosition={data.squaresPosition}
          />
        </div>

        {/* Right - Building/Cityscape Image */}
        <div className="w-[60%] sm:w-[60%] md:w-[62%] lg:w-[63%] xl:w-[64%] 2xl:w-[65%] 3xl:w-[65%] 4xl:w-[65%] relative h-full overflow-hidden group cursor-pointer flex items-center">
          <img
            ref={imageRef}
            src={data.buildingImageSrc}
            className="w-full h-auto object-cover object-[80%_50%] text-element transition-all duration-700 ease-out"
            alt=""
          />
          <div className="absolute inset-0 bg-black/0  transition-all duration-500" />
        </div>
        
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: buildingElements (Slide 7)
// UPDATED: Heading positioned at 35% from top
// ============================================
const BuildingElementsSlide = ({ data }) => {
  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />
      {data.backgroundTree && (
        <img
          src={data.backgroundTree}
          className="object-cover w-[50%] h-auto absolute bottom-[50px] sm:bottom-[60px] md:bottom-[70px] lg:bottom-[80px] xl:bottom-[90px] 2xl:bottom-[110px] 3xl:bottom-[140px] 4xl:bottom-[180px] left-0"
          alt=""
        />
      )}

      <div className="absolute inset-0 flex">
        {/* Left Section - Element thumbnails with text */}
        <div className="w-[18%] sm:w-[18%] md:w-[18%] lg:w-[17%] xl:w-[16%] 2xl:w-[15%] 3xl:w-[15%] 4xl:w-[15%] px-1.5 py-3 sm:px-2 sm:py-4 md:px-2.5 md:py-5 lg:px-3 lg:py-6 xl:px-4 xl:py-8 2xl:px-6 2xl:py-12 3xl:px-8 3xl:py-16 4xl:px-12 4xl:py-20 flex flex-col justify-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-8 3xl:gap-10 4xl:gap-14 h-full">
          {data.elements.map((element, index) => (
            <div
              key={index}
              className="flex flex-col group cursor-pointer items-end"
            >
              <div className="overflow-hidden relative flex-shrink-0 w-9 h-7 sm:w-10 sm:h-8 md:w-12 md:h-10 lg:w-16 lg:h-12 xl:w-20 xl:h-16 2xl:w-28 2xl:h-24 3xl:w-36 3xl:h-28 4xl:w-48 4xl:h-40">
                <img
                  src={element.src}
                  className="w-full h-full object-cover text-element transition-all duration-500 ease-out  group-hover:brightness-110"
                  alt=""
                />
              </div>
              {/* Cream/Ivory Gradient Fade Effect */}
              <p 
                className="text-neutral-800 text-[3.5px] sm:text-[4px] md:text-[4.5px] lg:text-[6px] xl:text-[7px] 2xl:text-[9px] 3xl:text-[12px] 4xl:text-[15px] font-futura-bk leading-snug mt-0.5 sm:mt-0.5 md:mt-1 lg:mt-1 xl:mt-1.5 2xl:mt-2 3xl:mt-2.5 4xl:mt-3 uppercase tracking-wide text-element text-right px-1.5 sm:px-2 md:px-2.5 lg:px-3 xl:px-4 2xl:px-5 py-0.5 sm:py-1 md:py-1.5 lg:py-2 xl:py-2.5 2xl:py-3 rounded-sm"
                style={{ 
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 253, 245, 0.9) 25%, rgba(250, 248, 240, 0.95) 100%)'
                }}
              >
                {element.text}
              </p>
            </div>
          ))}
        </div>

        {/* Center Section - Main Building Image */}
        <div className="w-[47%] sm:w-[47%] md:w-[47%] lg:w-[48%] xl:w-[49%] 2xl:w-[47%] 3xl:w-[47%] 4xl:w-[47%] h-full flex items-center justify-center p-1 sm:p-1.5 md:p-2 lg:p-3 xl:p-5 2xl:p-8 3xl:p-10 4xl:p-14 overflow-hidden group cursor-pointer relative">
          <img
            src={data.mainImageSrc}
            className="h-[88%] sm:h-[89%] md:h-[89%] lg:h-[90%] xl:h-[90%] 2xl:h-[90%] object-contain text-element transition-all duration-700 ease-out absolute left-[12%] sm:left-[14%] md:left-[16%] lg:left-[18%] xl:left-[20%] 2xl:left-30 3xl:left-40 4xl:left-52 -bottom-3 sm:-bottom-4 md:-bottom-5 lg:-bottom-5 xl:-bottom-6 2xl:-bottom-7 3xl:-bottom-9 4xl:-bottom-12"
            alt=""
          />
        </div>

        {/* Right Section - Title, Description, Squares */}
        <div className="w-[35%] sm:w-[35%] md:w-[35%] lg:w-[35%] xl:w-[35%] 2xl:w-[35%] 3xl:w-[35%] 4xl:w-[35%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-14 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-28 4xl:py-28 flex flex-col justify-between h-full relative">
          {/* Title - positioned at 35% from top */}
          <div className="text-right">
            <h2 
              className="absolute text-black text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-lg 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl font-futura-bk uppercase tracking-wide text-element right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-14 3xl:right-20 4xl:right-28"
              style={{ top: '10%' }}
            >
              {data.title}
            </h2>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Description and Squares at bottom */}
          <div className="text-right">
            {data.description && (
              <p className="text-black text-[4.5px] sm:text-[5px] md:text-[5.5px] lg:text-[10px] xl:text-[13px] 2xl:text-[16px] 3xl:text-[20px] 4xl:text-lg font-futura-bk leading-relaxed mb-1.5 sm:mb-2 md:mb-2.5 lg:mb-3 xl:mb-4 2xl:mb-6 3xl:mb-8 4xl:mb-10 text-element">
                {data.description}
              </p>
            )}

            {/* Accent Squares */}
            <AccentSquares
              accentSquares={data.accentSquares}
              seaBoxSrc={data.seaBoxSrc}
              squaresPosition={data.squaresPosition}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
// ============================================
// SLIDE TYPE: fullImage (Slide 8)
// ============================================
const FullImageSlide = ({ data }) => {
  return (
    <div className="w-full h-full relative">
      <img
        src={data.imageSrc}
        className="object-cover w-full h-full text-element"
        alt=""
      />
    </div>
  );
};

// ============================================
// SLIDE TYPE: mapSlide (Slide 9)
// UPDATED: Heading aligned with map image top
// ============================================
const MapSlide = ({ data }) => {
  const containerRef = useRef(null);
  const mapImageRef = useRef(null);
  
  const headingTop = useImageTopAlignment(mapImageRef, containerRef, {
    defaultTopPercent: 15,
    minTopPx: 16,
  });

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Background */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left Section - Title, Distances, Squares */}
        <div className="w-[35%] sm:w-[35%] md:w-[35%] lg:w-[35%] xl:w-[35%] 2xl:w-[35%] 3xl:w-[35%] 4xl:w-[35%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-14 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-28 4xl:py-28 flex flex-col justify-between h-full relative">
          {/* Title - dynamically positioned */}
          <div>
            <h2 
              className="text-black text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-lg 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl font-futura-bk uppercase tracking-widest whitespace-pre-line leading-tight text-element absolute"
              style={{ top: headingTop }}
            >
              {data.title}
            </h2>
          </div>

          {/* Distances list */}
          {data.distances && (
            <div className="space-y-0.5 sm:space-y-0.5 md:space-y-1 lg:space-y-1.5 xl:space-y-2 2xl:space-y-2.5 3xl:space-y-3 4xl:space-y-4 absolute bottom-[12%] sm:bottom-[13%] md:bottom-[14%] lg:bottom-[15%] xl:bottom-[18%] 2xl:bottom-30 3xl:bottom-40 4xl:bottom-52">
              {data.distances.map((item, index) => (
                <p
                  key={index}
                  className="text-black text-[5px] sm:text-[6px] md:text-[8px] lg:text-[11px] xl:text-[13px] 2xl:text-lg 3xl:text-xl 4xl:text-xl font-futura-bk text-element"
                >
                  {item.place}: {item.distance}
                </p>
              ))}
            </div>
          )}

          {/* Accent Squares at bottom left */}
          <AccentSquares
            accentSquares={data.accentSquares}
            seaBoxSrc={data.seaBoxSrc}
            squaresPosition={data.squaresPosition}
          />
        </div>

        {/* Right Section - Map Image */}
        <div className="w-[65%] sm:w-[65%] md:w-[65%] lg:w-[65%] xl:w-[65%] 2xl:w-[70%] 3xl:w-[65%] 4xl:w-[65%] relative h-full overflow-hidden group cursor-pointer flex items-center">
          <img
            ref={mapImageRef}
            src={data.mapImageSrc}
            className="w-full h-full object-cover text-element transition-all duration-700 ease-out absolute right-0 pl-13 xl:object-[0%]"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE TYPE: fullImage (Slide 10)
// ============================================
const FullImageSlide2 = ({ data }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={data.imageSrc}
        className="w-full h-full object-cover text-element"
        alt=""
      />
    </div>
  );
};

// ============================================
// SLIDE TYPE: portfolioSlide (Slide 11)
// UPDATED: Text aligned with building images container top
// ============================================
const PortfolioSlide = ({ data }) => {
  const containerRef = useRef(null);
  const imagesContainerRef = useRef(null);
  const [labelOffset, setLabelOffset] = useState(0);
  
  const headingTop = useImageTopAlignment(imagesContainerRef, containerRef, {
    defaultTopPercent: 18,
    minTopPx: 16,
  });

  // Calculate the label offset from top of image container
  useEffect(() => {
    const calculateLabelOffset = () => {
      if (!imagesContainerRef.current || !containerRef.current) return;
      
      const imageRect = imagesContainerRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Get the top of the image relative to the main container
      // Add a small pixel offset (e.g., 8-12px) from the top of the image
      const imageTop = imageRect.top - containerRect.top;
      const offsetFromImageTop = 8; // pixels below the top of the image
      
      setLabelOffset(imageTop + offsetFromImageTop);
    };

    calculateLabelOffset();
    
    // Recalculate on resize
    window.addEventListener('resize', calculateLabelOffset);
    
    // Also recalculate after images load
    const img = imagesContainerRef.current;
    if (img) {
      img.addEventListener('load', calculateLabelOffset);
    }

    return () => {
      window.removeEventListener('resize', calculateLabelOffset);
      if (img) {
        img.removeEventListener('load', calculateLabelOffset);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Background Image */}
      <img
        src={data.backgroundSrc}
        className="object-cover w-full h-full absolute inset-0"
        alt=""
      />

      <div className="absolute inset-0 flex">
        {/* Left Section - 3 Building Images */}
        <div className="w-[65%] sm:w-[65%] md:w-[65%] lg:w-[65%] xl:w-[68%] 2xl:w-[70%] 3xl:w-[70%] 4xl:w-[70%] relative h-full">
          <div className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-2.5 xl:gap-3 2xl:gap-3 3xl:gap-4 4xl:gap-5 h-full">
            {data.buildings.map((building, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col group cursor-pointer relative h-full overflow-hidden justify-center"
              >
                {/* Full height image - ref on first image container */}
                <img
                  ref={index === 0 ? imagesContainerRef : null}
                  src={building.src}
                  className="w-full h-[65%] object-cover text-element transition-all duration-700 ease-out"
                  style={{
                    objectPosition: building.objectPosition || "50% 50%",
                  }}
                  alt={building.name}
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {/* Label positioned dynamically from image top */}
                <div 
                  className="absolute left-0 right-0 text-center"
                  style={{ top: `${labelOffset}px` }}
                >
                  <p className="text-white text-[5px] sm:text-[5.5px] md:text-[6px] lg:text-[7px] xl:text-[9px] 2xl:text-sm 3xl:text-base 4xl:text-xl uppercase font-futura-bk tracking-wider text-element drop-shadow-lg">
                    {building.name}
                  </p>
                  <p className="text-white text-[4px] sm:text-[4.5px] md:text-[5px] lg:text-[6px] xl:text-[8px] 2xl:text-xs 3xl:text-sm 4xl:text-lg uppercase font-futura-bk opacity-80 tracking-wider text-element drop-shadow-lg">
                    {building.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Text and Squares */}
        <div className="w-[35%] sm:w-[35%] md:w-[35%] lg:w-[35%] xl:w-[32%] 2xl:w-[35%] 3xl:w-[35%] 4xl:w-[35%] px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 2xl:px-14 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-28 4xl:py-28 flex flex-col justify-between h-full relative">
          {/* Spacer */}
          <div></div>

          {/* Text lines - dynamically positioned */}
          <div 
            className="text-right absolute right-3 sm:right-4 md:right-5 lg:right-6 xl:right-8 2xl:right-14 3xl:right-20 4xl:right-28"
            style={{ top: headingTop }}
          >
            {data.textLines.map((line, index) => (
              <p
                key={index}
                className="text-black text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs 2xl:text-xl 3xl:text-3xl 4xl:text-4xl font-futura-bk tracking-widest uppercase text-element leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Accent Squares at bottom right */}
          <AccentSquares
            accentSquares={data.accentSquares}
            seaBoxSrc={data.seaBoxSrc}
            squaresPosition={data.squaresPosition}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE ROUTER
// ============================================
const Slide = ({ data }) => {
  switch (data.slideType) {
    case "splitBackground":
      return <SplitBackgroundSlide data={data} />;
    case "threeArchitects":
      return <ThreeArchitectsSlide data={data} />;
    case "architectIndividual":
      return <ArchitectIndividualSlide data={data} />;
    case "buildingShowcase":
      return <BuildingShowcaseSlide data={data} />;
    case "buildingElements":
      return <BuildingElementsSlide data={data} />;
    case "fullImage":
      return <FullImageSlide data={data} />;
    case "mapSlide":
      return <MapSlide data={data} />;
      case "fullImageContain":
      return <FullImageSlide2 data={data} />;
    case "portfolioSlide":
      return <PortfolioSlide data={data} />;
    default:
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          Unknown slide type
        </div>
      );
  }
};

// ============================================
// MAIN FEATURES COMPONENT
// ============================================
const Features = () => {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = type1SlidesData.length;

  // Determine animation direction based on slide index
  const getDirection = (index) => {
    return index % 2 === 0 ? "fromTop" : "fromBottom";
  };

  const directions = {
    fromTop: {
      initial: { clipPath: "inset(0 0 100% 0)" },
      animate: { clipPath: "inset(0 0 0% 0)" },
      exit: { clipPath: "inset(100% 0 0 0)" },
    },
    fromBottom: {
      initial: { clipPath: "inset(100% 0 0 0)" },
      animate: { clipPath: "inset(0% 0 0 0)" },
      exit: { clipPath: "inset(0 0 100% 0)" },
    },
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;

    let targetIndex = index;
    if (index < 0) {
      targetIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      targetIndex = 0;
    }

    setIsAnimating(true);

    const currentSlideEl = containerRef.current?.querySelector(
      `[data-slide-index="${currentSlide}"]`,
    );
    const nextSlideEl = containerRef.current?.querySelector(
      `[data-slide-index="${targetIndex}"]`,
    );

    if (!currentSlideEl || !nextSlideEl) {
      setIsAnimating(false);
      return;
    }

    const direction = directions[getDirection(targetIndex)];

    const currentTextElements =
      currentSlideEl.querySelectorAll(".text-element");
    const nextTextElements = nextSlideEl.querySelectorAll(".text-element");

    // Ensure next slide's text elements are completely hidden
    gsap.set(nextTextElements, { opacity: 0 });

    // Set initial clip-path for incoming slide
    gsap.set(nextSlideEl, {
      clipPath: direction.initial.clipPath,
      zIndex: 2,
    });

    // Main slide transition animation
    gsap.to(nextSlideEl, {
      clipPath: direction.animate.clipPath,
      duration: 1.2,
      ease: "hop",
      onComplete: () => {
        // Update z-indices after transition completes
        gsap.set(currentSlideEl, { zIndex: 0 });
        gsap.set(nextSlideEl, { zIndex: 1 });
        
        // Hide current slide's text elements
        gsap.set(currentTextElements, { opacity: 0 });

        // NOW fade in the next slide's text elements (after transition is complete)
        gsap.to(nextTextElements, {
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power1.out",
          onComplete: () => {
            // Only update state after everything is done
            setCurrentSlide(targetIndex);
            setIsAnimating(false);
          },
        });
      },
    });
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  // Wheel navigation
  useEffect(() => {
    let wheelTimeout;
    const handleWheel = (e) => {
      if (isAnimating) return;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }, 50);
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: true });
    return () => container?.removeEventListener("wheel", handleWheel);
  }, [currentSlide, isAnimating]);

  // Touch navigation
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (isAnimating) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchend", handleTouchEnd);
    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, isAnimating]);

  // Initialize slides
  useGSAP(
    () => {
      const slides = containerRef.current?.querySelectorAll(".slide");

      // Initially hide all text elements
      const allTextElements =
        containerRef.current?.querySelectorAll(".text-element");
      gsap.set(allTextElements, { opacity: 0 });

      slides?.forEach((slide, index) => {
        if (index === 0) {
          // First slide is visible
          gsap.set(slide, {
            clipPath: "inset(0 0 0 0)",
            zIndex: 1,
          });
          // Fade in first slide's text elements
          const textElements = slide.querySelectorAll(".text-element");
          gsap.to(textElements, {
            opacity: 1,
            duration: 0.8,
            stagger: 0.06,
            delay: 0.3,
            ease: "power1.out",
          });
        } else {
          // Other slides are hidden with their initial clip-path
          const direction = directions[getDirection(index)];
          gsap.set(slide, {
            clipPath: direction.initial.clipPath,
            zIndex: 0,
          });
        }
      });
    },
    { scope: containerRef },
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <Loader>
      <CloseButton />

      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative font-futura-bk"
      >
        <div className="relative w-full h-full">
          {/* Render all slides */}
          {type1SlidesData.map((slideData, index) => (
            <div
              key={slideData.id}
              data-slide-index={index}
              className="slide absolute inset-0 w-full h-full overflow-hidden"
            >
              <div className="slide-content absolute inset-0 w-full h-full">
                <Slide data={slideData} />
              </div>
            </div>
          ))}

          {/* Progress Indicator */}
          <div className="bottom-2 sm:bottom-2.5 md:bottom-3 lg:bottom-4 xl:bottom-5 2xl:bottom-6 3xl:bottom-8 4xl:bottom-10 w-[88%] sm:w-[85%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] 3xl:w-[50%] 4xl:w-[50%] px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 3xl:px-16 4xl:px-20 absolute left-1/2 -translate-x-1/2 z-50">
            <div className="relative w-full h-[2px] sm:h-[2px] md:h-[3px] lg:h-[3px] xl:h-[3px] 2xl:h-1 3xl:h-1.5 4xl:h-2 bg-gray-300 rounded-none overflow-hidden opacity-70">
              <div
                className="h-full bg-gray-500 transition-all duration-300 ease-out rounded-none"
                style={{
                  width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Loader>
  );
};

export default Features;