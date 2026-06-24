import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Exhibitors from './pages/Exhibitors';
import Sponsors from './pages/Sponsors';
import Awards from './pages/Awards';
import Awardees from './pages/Awardees';
import Register from './pages/Register';
import FamilyTour from './pages/FamilyTour';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ExhibitorDashboard from './pages/exhibitor/ExhibitorDashboard';
import SponsorDashboard from './pages/sponsor/SponsorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/exhibitors" element={<Exhibitors />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/awardees" element={<Awardees />} />
          <Route path="/register" element={<Register />} />
          <Route path="/family-tour" element={<FamilyTour />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboards (own layout, nested routing) */}
        <Route path="/exhibitor/*" element={<ExhibitorDashboard />} />
        <Route path="/sponsor/*" element={<SponsorDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
