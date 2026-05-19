import { Route, Routes } from "react-router-dom";

import { SiteLayout } from "@/components/layout/SiteLayout";
import HomePage from "@/pages/HomePage";
import BookingPage from "@/pages/BookingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Route>
    </Routes>
  );
}
