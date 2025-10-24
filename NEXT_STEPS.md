# Next Steps - Implementation Guide

## Current Progress

✅ **Completed (22 files):**
- Project configuration (package.json, tsconfig, vite.config, tailwind.config)
- Data files (members.json, services.json, rules.json)
- Type definitions and configuration
- Utility functions (validation, formatting, form helpers)
- Custom hooks (useForm)
- Global styles with banking theme
- README documentation

## Immediate Next Steps

### 1. Install Dependencies (REQUIRED FIRST!)

```bash
npm install
```

### 2. Install shadcn/ui Components

```bash
npx shadcn@latest add button input label textarea select checkbox switch radio-group dialog alert-dialog toast toaster tooltip alert badge card
```

### 3. Install tailwindcss-animate

```bash
npm install -D tailwindcss-animate
```

## Remaining Files to Create

### A. useToast Hook (`src/hooks/ui/useToast.ts`)

```typescript
import { useToast as useToastPrimitive } from '@/components/ui/use-toast';

export const useToast = () => {
  const { toast } = useToastPrimitive();

  return {
    success: (message: string) => {
      toast({
        title: 'Success',
        description: message,
        variant: 'default',
      });
    },
    error: (message: string) => {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
    info: (message: string) => {
      toast({
        title: 'Info',
        description: message,
      });
    },
  };
};
```

### B. Constants Index (`src/constants/index.ts`)

```typescript
export * from './data/memberData';
export * from './data/servicesData';
export * from './data/rulesData';
```

### C. MemberCard Component (`src/components/cards/MemberCard/MemberCard.tsx`)

```typescript
import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FaUser, FaUserTie } from 'react-icons/fa';

interface MemberCardProps {
  member: Member;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="banking-card p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-banking-blue-100 flex items-center justify-center">
          {member.isStaff ? (
            <FaUserTie className="text-banking-blue-600 text-xl" />
          ) : (
            <FaUser className="text-banking-blue-600 text-xl" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-banking-gray-900">{member.name}</h3>
          <p className="text-sm text-banking-gray-600">{member.role}</p>
        </div>
        {member.isStaff && (
          <Badge variant="default" className="bg-banking-blue-600">
            Staff
          </Badge>
        )}
      </div>
    </div>
  );
};
```

### D. ServiceCard Component (`src/components/cards/ServiceCard/ServiceCard.tsx`)

```typescript
import { Service } from '@/types';
import * as Icons from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = (Icons as any)[service.icon];

  return (
    <div className="banking-card-hover p-6">
      <div className="w-14 h-14 rounded-lg bg-banking-blue-100 flex items-center justify-center mb-4">
        {IconComponent && <IconComponent className="text-banking-blue-600 text-2xl" />}
      </div>
      <h3 className="font-semibold text-xl text-banking-gray-900 mb-2">
        {service.title}
      </h3>
      <p className="text-banking-gray-600 leading-relaxed">
        {service.description}
      </p>
    </div>
  );
};
```

### E. Header Component (`src/components/layout/Header/Header.tsx`)

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBank, FaBars, FaTimes } from 'react-icons/fa';
import { appConfig } from '@/config';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-banking-md sticky top-0 z-50">
      <div className="banking-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <FaBank className="text-banking-blue-600 text-2xl" />
            <span className="font-display font-bold text-xl text-banking-gray-900">
              {appConfig.bankName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-banking-gray-700 hover:text-banking-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/members" className="text-banking-gray-700 hover:text-banking-blue-600 font-medium transition-colors">
              Members
            </Link>
            <Link to="/learn-more" className="text-banking-gray-700 hover:text-banking-blue-600 font-medium transition-colors">
              Learn More
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-banking-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-banking-gray-200">
            <Link
              to="/"
              className="block py-2 text-banking-gray-700 hover:text-banking-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/members"
              className="block py-2 text-banking-gray-700 hover:text-banking-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Members
            </Link>
            <Link
              to="/learn-more"
              className="block py-2 text-banking-gray-700 hover:text-banking-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Learn More
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
```

### F. Footer Component (`src/components/layout/Footer/Footer.tsx`)

```typescript
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { appConfig } from '@/config';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-banking-gray-900 text-white">
      <div className="banking-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4">{appConfig.bankFullName}</h3>
            <p className="text-banking-gray-400 mb-4">
              Your trusted cooperative banking partner providing transparent and flexible financial services.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-banking-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-banking-gray-400 hover:text-white transition-colors">
                  Members
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-banking-gray-400 hover:text-white transition-colors">
                  Learn More
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-2 text-banking-gray-400">
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <span>{appConfig.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone />
                <span>{appConfig.contactPhone}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <FaFacebook className="text-2xl hover:text-banking-blue-400 cursor-pointer transition-colors" />
              <FaTwitter className="text-2xl hover:text-banking-blue-400 cursor-pointer transition-colors" />
              <FaLinkedin className="text-2xl hover:text-banking-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-banking-gray-800 mt-8 pt-8 text-center text-banking-gray-400">
          <p>&copy; {currentYear} {appConfig.bankFullName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
```

### G. Hero Section (`src/components/sections/Hero/Hero.tsx`)

```typescript
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="banking-gradient-hero text-white">
      <div className="banking-container banking-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <FaShieldAlt className="text-6xl" />
          </div>
          <h1 className="banking-heading text-white mb-6">
            Ghosh Cooperative Bankings
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-banking-blue-100">
            Your Trusted Cooperative Banking Partner - Built on Transparency, Flexibility, and Community Support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/learn-more">
              <Button size="lg" className="bg-white text-banking-blue-600 hover:bg-banking-blue-50">
                Learn More
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/members">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Members
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
```

### H. App.tsx (React Router Setup)

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { LandingPage } from '@/pages/LandingPage/LandingPage';
import { MembersPage } from '@/pages/MembersPage/MembersPage';
import { LearnMorePage } from '@/pages/LearnMorePage/LearnMorePage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### I. main.tsx (Entry Point)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
);
```

### J. Landing Page (`src/pages/LandingPage/LandingPage.tsx`)

```typescript
import { Hero } from '@/components/sections/Hero/Hero';
import { Services } from '@/components/sections/Services/Services';
import { Members } from '@/components/sections/Members/Members';
import { GetHelp } from '@/components/sections/GetHelp/GetHelp';

export const LandingPage = () => {
  return (
    <>
      <Hero />
      <Services />
      <Members />
      <GetHelp />
    </>
  );
};
```

## Summary of Remaining Components

You need to create:

1. **Section Components:**
   - Services.tsx (grid of ServiceCard components)
   - Members.tsx (filtered staff members)
   - GetHelp.tsx (contains ContactForm)
   - Overview.tsx (detailed services for Learn More page)
   - Rulebook.tsx (rules display for Learn More page)

2. **Form Component:**
   - ContactForm.tsx (using useForm hook + validation)

3. **Pages:**
   - MembersPage.tsx (all members with filtering)
   - LearnMorePage.tsx (Overview + Rulebook)
   - NotFoundPage.tsx (404 error page)

4. **Barrel Exports:**
   - Index files for each folder for clean imports

## Key Implementation Notes

1. **Use react-icons**: Import icons from 'react-icons/fa'
2. **Use shadcn/ui components**: Button, Card, Badge, Alert, etc.
3. **Follow banking theme**: Use `banking-*` utility classes
4. **Responsive design**: Use Tailwind responsive classes (md:, lg:)
5. **Type safety**: Import types from `@/types`

## Testing After Implementation

```bash
npm run dev
```

Visit:
- http://localhost:5173/ (Landing)
- http://localhost:5173/members (Members)
- http://localhost:5173/learn-more (Learn More)

## Need Help?

Refer to the comprehensive README.md for:
- Complete project structure
- Feature descriptions
- Tech stack details
- Future enhancements

---

**Happy Coding! 🚀**
