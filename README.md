# Court Data Fetcher & Mini-Dashboard
https://court-data-umber.vercel.app/

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue.svg)](https://tailwindcss.com/)

A professional web application that allows users to search for case details from Indian courts, handle CAPTCHA verification, and maintain a comprehensive query history dashboard.

## 🏛️ Court Target

**Primary Target**: Delhi High Court (https://delhihighcourt.nic.in/)  
**Secondary Target**: Faridabad District Court (https://districts.ecourts.gov.in/faridabad)

## 🚀 Features

### Core Functionality
- **📋 Case Search Form**: Intuitive form with dropdowns for Case Type, Case Number, and Filing Year
- **🔐 CAPTCHA Handling**: Robust manual CAPTCHA verification system with refresh capability
- **📊 Case Details Display**: Comprehensive view of parties, filing dates, hearings, and orders
- **📄 PDF Downloads**: Direct download links for orders and judgments
- **📈 Query Dashboard**: Statistics and history tracking for all searches

### Professional Features
- **🎨 Modern UI/UX**: Beautiful design with legal theme and professional color scheme
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark Mode Support**: Toggle between light and dark themes
- **⚡ Real-time Feedback**: Toast notifications and loading states
- **🔍 Error Handling**: User-friendly error messages and retry mechanisms
- **💾 Local Storage**: Query history persisted across sessions

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Data Storage**: Local Storage (demo) / Supabase (production ready)

## 🔧 CAPTCHA Strategy

Our application implements a **manual CAPTCHA verification** approach:

1. **Detection**: Automatically detects when CAPTCHA is required
2. **Display**: Shows CAPTCHA image in a professional modal dialog
3. **Verification**: User manually enters CAPTCHA solution
4. **Validation**: Client-side validation with server-side verification simulation
5. **Retry**: Refresh option for new CAPTCHA if needed

This approach ensures:
- ✅ Legal compliance with court website terms
- ✅ Robust handling of different CAPTCHA types
- ✅ User-friendly experience with clear instructions
- ✅ Fallback mechanisms for failed verifications

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm installed
- Modern web browser

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd court-data-fetcher

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```


```

## 🎯 Usage

### Searching for a Case

1. **Select Court**: Choose from Delhi High Court or Faridabad District Court
2. **Choose Case Type**: Select appropriate case type from dropdown
3. **Enter Details**: Input case number and filing year
4. **Submit Search**: Click "Search Case Details"
5. **Handle CAPTCHA**: Complete verification if prompted
6. **View Results**: Review case details, parties, and orders

### Downloading Documents

1. Navigate to "Orders & Judgments" section
2. Click "Download PDF" next to any order
3. PDF will be downloaded automatically

### Viewing Dashboard

1. Click "Dashboard" tab
2. View query statistics and success rates
3. Browse recent search history
4. Analyze popular courts and case types

## 🔍 Demo Features

Since this is a demonstration application, it includes:

- **Mock Data**: Realistic case details with random data generation
- **Simulated CAPTCHA**: Demo CAPTCHA system for testing
- **Local Storage**: Query history stored locally
- **PDF Generation**: Mock PDF downloads

For production use, these would be replaced with:
- Real court website scraping
- Actual CAPTCHA integration
- Database storage (Supabase ready)
- Real PDF document handling

## 🏗️ Architecture

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── CaseSearchForm.tsx
│   ├── CaseDetailsDisplay.tsx
│   ├── CaptchaDialog.tsx
│   ├── QueryHistoryDashboard.tsx
│   └── CourtDataFetcher.tsx
├── services/            # Business logic
│   ├── courtService.ts  # Court data fetching
│   └── databaseService.ts # Query logging
├── types/               # TypeScript definitions
│   └── court.ts
├── hooks/               # Custom React hooks
└── pages/               # Page components
```

## 🔒 Security & Compliance

- **No Sensitive Data Storage**: No personal case information stored permanently
- **CAPTCHA Respect**: Proper CAPTCHA handling respects court website policies
- **Rate Limiting**: Built-in delays to prevent server overload
- **Error Handling**: Comprehensive error handling for robustness
- **Data Privacy**: User queries logged anonymously for analytics only

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 📊 Performance

- **Initial Load**: < 2 seconds
- **Search Response**: 2-5 seconds (including CAPTCHA)
- **Bundle Size**: Optimized with Vite
- **Mobile Performance**: 90+ Lighthouse score

## 🧪 Testing

The application includes comprehensive error handling and user feedback:

- ✅ Form validation
- ✅ Network error handling
- ✅ CAPTCHA validation
- ✅ Empty state handling
- ✅ Loading state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the icon set
- **Indian Judiciary** for maintaining public access to case information

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for the Indian Legal System**
