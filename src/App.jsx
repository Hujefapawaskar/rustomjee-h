import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Features from "./pages/Features";
import Map from "./pages/Map";
import ScrollToTop from "./components/ScrollToTop";
import OrientationLock from "./components/MobileOrientationAndFullscreen";
import MusicController from "./components/MusicController";
import HomeNav from "./pages/HomeNav";
import BackButtonHandler from "./components/BackButtonHandler ";
import Views from "./components/Views";
import VideoPlayer from "./pages/VideoPlayer";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const location = useLocation();
  const isVideoPage = location.pathname === "/videoplayer";
  
  const GlobalLogo = () => (
  <img
    src="/images/Brainwing-logo.webp"
    alt="Logo"
    className="fixed bottom-7 right-20 w-40 h-auto opacity-50 z-[9999] pointer-events-none"
  />
);

  return (
    <>
      <MusicController play={!isVideoPage} />
      <GlobalLogo />
      <ScrollToTop />
      <BackButtonHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomeNav />} />
        <Route path="/floorplan" element={<Inventory />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/features" element={<Features />} />
        <Route path="/map" element={<Map />} />
        <Route path="/views" element={<Views />} />
        <Route path="/videoplayer" element={<VideoPlayer />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/wishlist" element={<Wishlist />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <WishlistProvider>
      <OrientationLock>
        <BrowserRouter>
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              style: {
                border: '1px solid #C19A40',
                padding: '16px',
                color: '#1D2938',
                background: '#fff',
                boxShadow: '0 4px 15px -3px rgba(193, 154, 64, 0.3)'
              },
              success: {
                iconTheme: {
                  primary: '#C19A40',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#1D2938',
                  secondary: '#fff',
                },
              }
            }}
          />
          <AppContent />
        </BrowserRouter>
      </OrientationLock>
    </WishlistProvider>
  );
};

export default App;