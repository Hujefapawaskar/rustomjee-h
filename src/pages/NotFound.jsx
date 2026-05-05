import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 min-h-screen bg-[#111] text-white font-sans p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-white opacity-[0.02] rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="z-10 text-center flex flex-col items-center">
        <h1 className="text-8xl md:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600 leading-none mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-light mb-6 tracking-wide">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-8 font-light">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <p className="text-sm text-gray-500 mb-8 animate-pulse">
          Redirecting to home page in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
        </p>

        <button 
          onClick={() => navigate('/')}
          className="group relative px-8 py-3 bg-white text-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10 font-semibold group-hover:text-white transition-colors duration-300">
            Return to Home
          </span>
          <div className="absolute inset-0 h-full w-0 bg-black transition-all duration-300 ease-out group-hover:w-full z-0"></div>
          {/* Subtle border to keep it visible on dark background */}
          <div className="absolute inset-0 border border-white z-20"></div>
        </button>
      </div>
    </div>
  );
};

export default NotFound;