# Ghosh Cooperative Bankings

A modern, professional cooperative banking website built with React, TypeScript, and Tailwind CSS.

## 📋 Project Overview

Ghosh Cooperative Bankings is a cooperative banking institution website featuring:
- **Landing Page** with Hero, Services, Members (Staff), and Get Help sections
- **Members Page** displaying all bank members with staff/member distinctions
- **Learn More Page** with detailed service information and comprehensive rulebook
- Professional banking UI with white primary color and blue accents
- Fully responsive design for all screen sizes
- Client-side form validation (no backend required yet)

## 🛠️ Tech Stack

- **Frontend Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom banking theme
- **UI Components:** shadcn/ui component library
- **Routing:** React Router v6
- **Icons:** React Icons
- **Fonts:** Inter (body), Poppins (headings) via Google Fonts

## 📁 Project Structure

```
ghosh-cooperative-bankings/
├── data/                          # JSON data files
│   ├── members.json              # All member data
│   ├── services.json             # Banking services
│   └── rules.json                # Banking rulebook
├── src/
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── cards/                # MemberCard, ServiceCard
│   │   ├── forms/                # ContactForm
│   │   └── sections/             # Hero, Services, Members, GetHelp, Overview, Rulebook
│   ├── pages/                    # Page components
│   │   ├── LandingPage/
│   │   ├── MembersPage/
│   │   ├── LearnMorePage/
│   │   └── NotFoundPage/
│   ├── hooks/                    # Custom React hooks
│   │   ├── form/                 # useForm hook
│   │   └── ui/                   # useToast hook
│   ├── utils/                    # Utility functions
│   │   ├── validation/           # Form validation
│   │   ├── formatting/           # Currency, phone formatters
│   │   └── responsive/           # Breakpoint utilities
│   ├── helpers/                  # Helper functions
│   │   └── forms/                # Form helper utilities
│   ├── constants/                # Constants and data
│   │   └── data/                 # Data imports from JSON
│   ├── types/                    # TypeScript type definitions
│   ├── config/                   # App configuration
│   ├── lib/                      # Library utilities (cn function)
│   ├── App.tsx                   # React Router configuration
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles with banking theme
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── components.json               # shadcn/ui configuration
└── .gitignore                    # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed on your machine

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install shadcn/ui components:**
```bash
npx shadcn@latest add button input label textarea select checkbox switch radio-group dialog alert-dialog toast toaster tooltip alert badge card
```

3. **Add tailwindcss-animate plugin:**
```bash
npm install -D tailwindcss-animate
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

## ✨ Features

### Landing Page
- **Hero Section:** Eye-catching gradient hero with cooperative banking tagline
- **Services Section:** 5 key services displayed in a responsive grid
  - Full Transparency
  - Take Loan Anytime
  - Flexible Monthly Payments
  - Rs.100 Monthly Service Fee
  - Financial Support Anytime
- **Members Section:** Staff members only with "View All Members" CTA
- **Get Help Section:** Contact form with email, phone, and message fields

### Members Page
- Complete list of all members (staff + regular members)
- Separate sections for staff and regular members
- Staff badge indicators
- "Register as a Member" button (placeholder for future functionality)
- Responsive grid layout

### Learn More Page
- **Overview:** Detailed descriptions of all banking services
- **Rulebook:** Comprehensive list of 6 banking rules:
  1. Monthly Service Fee (Rs.100)
  2. Deposit Policy (1% transaction fee)
  3. Daily Deposit Limits (Rs.10,000/day, Rs.5,000/transaction)
  4. Loan Restrictions (1 loan at a time)
  5. Credit Score Requirement (minimum 3/10)
  6. Bank Type Disclaimer (cooperative, not commercial)

### Form Validation
- Client-side email validation
- Indian phone number format validation
- Message length validation (minimum 10 characters)
- Real-time error display
- Success toast notifications

### Banking Theme
- **Primary Color:** White (`#FFFFFF`)
- **Accent Color:** Blue shades (`#3B82F6`, `#2563EB`, `#1D4ED8`)
- Custom shadows: `banking-sm`, `banking-md`, `banking-lg`, `banking-xl`
- Custom gradients: `gradient-blue`, `gradient-white-blue`
- Professional typography with Inter and Poppins fonts

## 🎯 Banking Services

1. **Full Transparency:** Complete visibility into all operations
2. **Take Loan Anytime:** Access loans when needed (credit score 3/10+)
3. **Flexible Monthly Payments:** You decide the monthly payment amount
4. **Rs.100 Monthly Fee:** Fixed service fee to keep operations running
5. **Financial Support Anytime:** Community-based financial assistance

## 👥 Bank Members

### Staff
- **Souvik Ghosh** - Founder
- **Malati Ghosh** - Official Secretary
- **Sudipta Ghosh** - Management Team
- **Anish Pal** - Management Team

### Regular Members
- Ajanta Pal
- Kashinath Pal
- Kaushik Ghosh
- Satarupa Pal
- Arinjoy Pal Panja

## 📜 Banking Rules

1. **Rs.100 monthly fee** (separate from account balance)
2. **Deposit with 1% transaction fee**
3. **Daily limit:** Rs.10,000/day, Rs.5,000/transaction
4. **Maximum 1 loan at a time**
5. **Minimum credit score:** 3/10 for loans
6. **Cooperative bank** (not a commercial bank)

## 🔄 Remaining Implementation Tasks

The following components and features still need to be implemented:

### Hooks
- [ ] `src/hooks/form/useForm.ts` - Form state management hook
- [ ] `src/hooks/ui/useToast.ts` - Toast notification hook wrapper

### Helpers
- [ ] `src/helpers/forms/formHelpers.ts` - Form sanitization and utilities

### Components
- [ ] All layout components (Header, Navigation, Footer)
- [ ] All card components (MemberCard, ServiceCard)
- [ ] All section components (Hero, Services, Members, GetHelp, Overview, Rulebook)
- [ ] ContactForm component
- [ ] All shadcn/ui components (need to be installed)

### Pages
- [ ] Landing Page
- [ ] Members Page
- [ ] Learn More Page
- [ ] 404 Not Found Page

### Core Files
- [ ] `src/App.tsx` - React Router setup
- [ ] `src/main.tsx` - Entry point with Toaster

### Utilities
- [ ] `src/utils/responsive/breakpoints.ts` - Responsive utilities
- [ ] Index barrel exports for clean imports

## 🎨 Design Guidelines

- **Responsive:** Mobile-first design approach
- **Accessibility:** WCAG 2.1 AA compliant
- **Performance:** Optimized bundle size and lazy loading
- **SEO:** Semantic HTML and meta tags
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

## 📝 Notes

- All data is stored in JSON files (`/data` folder) for easy maintenance
- No backend integration yet - form submissions show success toast only
- Registration functionality is a placeholder for future implementation
- Icons use react-icons library (FaEye, FaHandHoldingUsd, FaChartLine, FaRupeeSign, FaHandsHelping)

## 🔮 Future Enhancements

- [ ] User authentication and login system
- [ ] Member registration functionality
- [ ] Backend API integration for forms
- [ ] Account dashboard for members
- [ ] Loan application system
- [ ] Transaction history
- [ ] Credit score tracking
- [ ] Admin panel for bank management
- [ ] Email notifications
- [ ] Document upload functionality

## 📄 License

This project is proprietary software for Ghosh Cooperative Bankings.

## 👨‍💻 Development

To continue development, install dependencies and add the remaining component files following the structure defined above. Each component should use the banking theme utilities defined in `src/index.css` and follow TypeScript best practices.

---

**Bank Name:** Ghosh Cooperative Bankings  
**Bank Tagline:** Your Trusted Cooperative Banking Partner  
**Monthly Fee:** Rs.100  
**Contact:** contact@ghoshbank.coop | +91 1234567890
