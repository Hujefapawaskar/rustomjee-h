import React, { useEffect, useRef, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { LuFileText } from "react-icons/lu";

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const pdfGeneratedRef = useRef(false);

  const generatePDF = async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Helper function to load an image
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Front Page
      // Background
      pdf.setFillColor(29, 41, 56);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      
      // Brand Logo
      try {
        const logoImg = await loadImage("/images/logo.png");
        const logoW = 120;
        const logoH = logoW * (logoImg.height / logoImg.width);
        pdf.addImage(logoImg, "PNG", (pageWidth - logoW) / 2, 80, logoW, logoH);
      } catch (e) {
        console.error("Logo not found", e);
      }

      // Project Name
      pdf.setTextColor(193, 154, 64); // #C19A40 Golden
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.text("RUSTOMJEE", pageWidth / 2, 230, { align: "center" });
      
      // Subtitle
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(16);
      pdf.text("Curated Floorplans & Premium Balcony Views", pageWidth / 2, 260, { align: "center" });

      // Good Design / Building Cover Image
      try {
        const coverImg = await loadImage("/images/full-body.jpg");
        const drawWidth = pageWidth - 100;
        let drawHeight = drawWidth * (coverImg.height / coverImg.width);
        
        // Keep it within a certain bound so it fits well on the page
        if (drawHeight > 350) {
          drawHeight = 350;
        }
        
        // Draw bordered rect behind
        pdf.setDrawColor(193, 154, 64);
        pdf.setLineWidth(2);
        pdf.rect(50 - 4, 310 - 4, drawWidth + 8, drawHeight + 8);
        
        pdf.addImage(coverImg, "JPEG", 50, 310, drawWidth, drawHeight);
      } catch (e) {
        console.error("Cover image not found", e);
      }

      // Title
      pdf.setTextColor(193, 154, 64);
      pdf.setFontSize(26);
      pdf.setFont("helvetica", "bold");
      pdf.text("YOUR EXCLUSIVE WISHLIST", pageWidth / 2, pageHeight - 80, { align: "center" });

      for (let i = 0; i < wishlist.length; i++) {
        pdf.addPage();
        const item = wishlist[i];
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.text(item.name, 40, 50);

        try {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = item.image;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          const imgRatio = img.width / img.height;
          let drawWidth = pageWidth - 80;
          let drawHeight = drawWidth / imgRatio;
          
          if (drawHeight > pageHeight - 100) {
            drawHeight = pageHeight - 100;
            drawWidth = drawHeight * imgRatio;
          }
          
          const x = (pageWidth - drawWidth) / 2;
          pdf.addImage(img, "JPEG", x, 80, drawWidth, drawHeight);
        } catch(err) {
          console.error("Failed to add image", err);
        }
      }

      pdf.save("Rustomjee_Wishlist.pdf");
    } catch (err) {
      console.error("PDF gen failed", err);
    }
    setDownloading(false);
  };

  useEffect(() => {
    if (wishlist.length > 0 && !pdfGeneratedRef.current) {
      pdfGeneratedRef.current = true;
      const timer = setTimeout(() => {
        generatePDF();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [wishlist]);

  const shareUrl = window.location.href; // In real app, this should be a public link to the PDF
  
  if (wishlist.length === 0) {
    return (
      <div 
        className="min-h-screen font-futura-bk relative flex flex-col items-center justify-center p-4"
        style={{
          zIndex: 1,
          backgroundImage: "url('/slides/bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <button onClick={() => navigate(-1)} className="fixed top-4 left-4 bg-white p-2 rounded shadow-md z-50 text-[#C19A40] border border-[#C19A40] hover:bg-[#C19A40] hover:text-white transition-colors">Back</button>
        <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_-5px_rgba(193,154,64,0.4)] border border-[#C19A40] flex flex-col items-center relative z-10">
          <img src="/images/logo.png" alt="Company Logo" className="h-16 object-contain mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">Go back to the floorplan to like some images first.</p>
          <button onClick={() => navigate("/floorplan")} className="bg-[#C19A40] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-opacity">
            Go to Floorplans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen font-futura-bk relative flex flex-col items-center"
      style={{
        zIndex: 1,
        backgroundImage: "url('/slides/bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <button onClick={() => navigate(-1)} className="fixed top-4 left-4 bg-white px-4 py-2 rounded shadow-md z-50 hover:bg-gray-100 text-[#C19A40] border border-[#C19A40] transition-colors hover:bg-[#C19A40] hover:text-white">
        Back
      </button>

      <div className="w-full max-w-4xl bg-white min-h-screen p-8 shadow-[0_0_30px_-5px_rgba(193,154,64,0.3)] flex flex-col pt-16 border-x-2 border-[#C19A40] relative z-10">
        <div className="flex flex-col items-center text-center mb-10 border-b border-[#C19A40]/30 pb-8">
          <img src="/images/logo.png" alt="Company Logo" className="h-24 object-contain mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 font-balgin mb-2 text-[#C19A40]">Your Wishlist Export</h1>
          <p className="text-gray-500">Your selection of {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} is ready.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-stretch justify-center mb-12">
          {/* Download Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#faf9f6] rounded-xl border border-[#C19A40]/40 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-700">Digital Copy</h3>
            
            <button 
              onClick={generatePDF}
              disabled={downloading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 ${downloading ? 'bg-gray-400' : 'bg-[#C19A40] hover:bg-[#a68434] hover:scale-105'}`}
            >
              <LuFileText className="text-xl" />
              {downloading ? 'Preparing PDF...' : 'Download PDF Manual'}
            </button>
            <button 
              onClick={() => {
                clearWishlist();
                navigate("/floorplan");
              }}
              className={`w-full mt-4 py-3 rounded-xl text-[#C19A40] font-bold text-base transition-all shadow-sm border border-[#C19A40] flex items-center justify-center gap-2 hover:bg-gray-50`}
            >
              Reset Wishlist
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Your download should start automatically in a few seconds...
            </p>
          </div>

          {/* QR Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#faf9f6] rounded-xl border border-[#C19A40]/40 shadow-sm">
            <h3 className="text-xl font-bold mb-8 text-gray-700">Scan to View on Mobile</h3>
            
            {/* Glowing Wrapper */}
            <div className="relative flex items-center justify-center">
              {/* Animated glowing backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#C19A40] to-[#E5C158] rounded-3xl blur-lg opacity-70 animate-pulse"></div>
              {/* Inner animated ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#C19A40] via-white to-[#C19A40] rounded-2xl opacity-100 animate-[spin_4s_linear_infinite] [animation-play-state:running]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 4px, 4px 4px, 4px calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 4px, 0 4px)" }}></div>
              
              <div className="p-4 bg-white rounded-2xl shadow-2xl relative flex items-center justify-center border border-[#C19A40]/30 transform transition-transform hover:scale-105 duration-500">
                <QRCodeSVG 
                value={shareUrl} 
                size={180} 
                fgColor="#1D2938" 
                bgColor="#ffffff"
                level="H" 
                imageSettings={{
                  src: "/images/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            </div>
            <p className="text-sm text-[#C19A40] mt-8 text-center font-bold tracking-widest uppercase animate-pulse">
              Scan to view on your phone

            </p>
          </div>
        </div>

        {/* Contact & Share */}
        <div className="mt-auto pt-8 border-t border-[#C19A40]/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.open(`https://wa.me/?text=Check out my floorplan wishlist at Rustomjee: ${encodeURIComponent(shareUrl)}`, '_blank')}
              className="px-6 py-3 bg-[#C19A40] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#a68434] transition-all border border-[#C19A40]"
            >
              Share on WhatsApp
            </button>
            <button 
              className="px-6 py-3 bg-white text-[#C19A40] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all border border-[#C19A40]"
              onClick={() => document.location.href = "mailto:sales@rustomjee.com"}
            >
              Contact Us
            </button>
          </div>
          <div className="text-sm text-[#C19A40] mt-4 sm:mt-0 font-bold">
            &copy; 2026 Rustomjee. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

