import { Routes, Route } from 'react-router-dom';
import HomePage from "../pages/homepage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Future routes: */}
      {/* <Route path="/sheds" element={<ShedsPage />} /> */}
      {/* <Route path="/contact" element={<ContactPage />} /> */}
    </Routes>
  );
};

export default AppRouter;
