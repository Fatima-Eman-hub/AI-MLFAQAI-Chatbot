import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AmbientBackground from "./components/AmbientBackground";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";

function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative min-h-screen">
          <AmbientBackground />
          <Navbar />
          <ScrollToHash />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
