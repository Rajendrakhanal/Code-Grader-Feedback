import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Homepage from "../pages/Homepage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
