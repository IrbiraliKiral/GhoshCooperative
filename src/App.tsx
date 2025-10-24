import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { NoticeBanner } from '@/components/common/NoticeBanner/NoticeBanner';
import { LandingPage } from '@/pages/LandingPage/LandingPage';
import { MembersPage } from '@/pages/MembersPage/MembersPage';
import { LearnMorePage } from '@/pages/LearnMorePage/LearnMorePage';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pb-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/learn-more" element={<LearnMorePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
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
