import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useTheme } from "./context/ThemeContext";

// Lazy-loaded pages (downloaded only when the user opens them)
const MyRegistrations = lazy(() => import("./pages/MyRegistrations"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <Navbar />
      <Suspense fallback={<p style={{ padding: "2rem" }}>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;