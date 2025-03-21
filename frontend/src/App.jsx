import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Static Pages
import ContactUs from './pages/static/ContactUs';
import FAQ from './pages/static/FAQ';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import TermsOfUse from './pages/static/TermsOfUse';

// Layout Components
import Layout from './components/Layout';

function App() {
  return (
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
          </Route>
          {/* ...existing routes... */}
        </Routes>
      </LocalizationProvider>
    </ErrorBoundary>
  );
}

export default App;
