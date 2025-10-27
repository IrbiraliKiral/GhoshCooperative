import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { NoticeBanner } from '@/components/common/NoticeBanner/NoticeBanner';
import { LandingPage } from '@/pages/LandingPage/LandingPage';
import { MembersPage } from '@/pages/MembersPage/MembersPage';
import { LearnMorePage } from '@/pages/LearnMorePage/LearnMorePage';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { VerifyPage } from '@/pages/VerifyPage/VerifyPage';
import { getCurrentMachineSession, updateSessionAccess } from '@/services/sessionService';
import { ReactNode } from 'react';

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const session = getCurrentMachineSession();
  
  if (!session) {
    // No session found, redirect to verify page
    return <Navigate to="/verify" replace />;
  }
  
  // Update session access time
  updateSessionAccess();
  
  return <>{children}</>;
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pb-16">
            <Routes>
              {/* Verify page - no protection */}
              <Route path="/verify" element={<VerifyPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
              <Route path="/learn-more" element={<ProtectedRoute><LearnMorePage /></ProtectedRoute>} />
              <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <NoticeBanner />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
