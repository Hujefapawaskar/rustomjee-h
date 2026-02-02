import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const VideoPlayer = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleClose = () => {
    navigate("/home"); // Goes back to previous page
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            {/* Loading Text */}
            <p className="text-white text-lg font-futura-bk tracking-wider">Loading video...</p>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 group"
        aria-label="Close and return to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#ffffff] group-hover:text-white transition-colors duration-300"
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

      {/* Full Screen Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        controls
        loop
        onLoadedData={handleLoadedData}
      >
        <source src="/video/CliffTower.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;