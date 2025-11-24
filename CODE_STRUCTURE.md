# EduSparkz - Code Structure Documentation

## Project Overview

EduSparkz is a serverless quiz application built with React (frontend) and Supabase (backend). The application uses a modern, scalable architecture with intelligent features like AI-powered quiz generation and spaced repetition learning.

## Directory Structure

```
EduSparkz/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── dashboard/           # Dashboard-specific components
│   │   │   │   ├── DashboardLayout.jsx    # Main dashboard wrapper
│   │   │   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   │   │   ├── Header.jsx             # Dashboard header with user info and profile editing
│   │   │   │   ├── FileUploadCard.jsx     # File upload and quiz generation
│   │   │   │   └── QuizCard.jsx           # Quiz taking interface
│   │   │   ├── landing/             # Landing page components
│   │   │   │   ├── Header.jsx             # Landing page header
│   │   │   │   ├── HeroSection.jsx        # Hero section
│   │   │   │   ├── FeaturesSection.jsx    # Features showcase
│   │   │   │   ├── TestimonialsSection.jsx
│   │   │   │   ├── ContactSection.jsx
│   │   │   │   ├── FAQSection.jsx
│   │   │   │   ├── CTASection.jsx
│   │   │   │   └── FooterSection.jsx
│   │   │   ├── ui/                  # Shadcn UI components
│   │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
│   │   │   ├── VerifyOtp.jsx        # OTP verification
│   │   │   ├── ResendOtp.jsx        # OTP resend functionality
│   │   │   └── ThemeToggle.tsx      # Dark/light mode toggle
│   │   ├── context/                 # React Context providers
│   │   │   ├── useContext.jsx       # User authentication context
│   │   │   └── ThemeProvider.tsx    # Theme management context
│   │   ├── lib/                     # Utility libraries
│   │   │   └── supabase.js          # Supabase client initialization
│   │   ├── pages/                   # Page components (routes)
│   │   │   ├── Index.jsx            # Landing page
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Quiz.jsx             # Quiz taking page
│   │   │   ├── QuizResults.jsx      # Quiz results display
│   │   │   ├── History.jsx          # Quiz history
│   │   │   ├── LeaderBoard.jsx      # Leaderboard
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── App.jsx                  # Main app component with routing
│   │   └── main.jsx                 # App entry point
│   ├── public/                      # Static assets
│   └── package.json                 # Dependencies and scripts
├── supabase/                        # Supabase backend configuration
│   ├── functions/                   # Edge Functions (serverless)
│   │   └── generate-quiz/
│   │       └── index.ts             # AI quiz generation function
│   └── schema.sql                   # Database schema and RPC functions
├── backend/                         # Legacy backend (deprecated)
├── MIGRATION.md                     # Migration guide to Supabase
├── RETENTION_ALGORITHM.md           # Retention algorithm documentation
└── README.md                        # Project documentation
```

## Architecture Layers

### 1. **Frontend Layer (React + Vite)**

**Technology Stack:**
- React 18 with hooks
- React Router for navigation
- TanStack Query for data fetching
- Framer Motion for animations
- Shadcn UI components
- Tailwind CSS for styling

**Key Patterns:**
- **Context API:** User authentication state management
- **Protected Routes:** Authentication-based route access
- **Component Composition:** Reusable UI components
- **Custom Hooks:** Shared logic extraction

### 2. **Backend Layer (Supabase)**

**Services Used:**
- **Supabase Auth:** User authentication and session management
- **Supabase Database:** PostgreSQL with Row Level Security
- **Supabase Edge Functions:** Serverless functions for AI integration
- **Supabase RPC:** Custom database functions

**Database Tables:**
- `profiles` - User profile information
- `quizzes` - Quiz questions and metadata
- `quiz_results` - Quiz attempt results

### 3. **AI Layer (OpenAI)**

**Integration:**
- Edge Function calls OpenAI API
- Generates quiz questions from uploaded content
- Structured JSON output for consistency

## Component Hierarchy

```
App
├── UserProvider (Context)
│   ├── QueryClientProvider
│   │   ├── ThemeProvider
│   │   │   ├── BrowserRouter
│   │   │   │   ├── Routes
│   │   │   │   │   ├── Public Routes
│   │   │   │   │   │   ├── Index (Landing)
│   │   │   │   │   │   ├── Login
│   │   │   │   │   │   ├── Register
│   │   │   │   │   │   ├── VerifyOtp
│   │   │   │   │   │   └── ResendOtp
│   │   │   │   │   └── Protected Routes
│   │   │   │   │       ├── Dashboard
│   │   │   │   │       │   ├── DashboardLayout
│   │   │   │   │       │   │   ├── Sidebar
│   │   │   │   │       │   │   ├── Header
│   │   │   │   │       │   │   └── FileUploadCard
│   │   │   │   │       ├── Quiz
│   │   │   │   │       │   └── QuizCard
│   │   │   │   │       ├── QuizResults
│   │   │   │   │       ├── History
│   │   │   │   │       └── LeaderBoard
```

## Data Flow

### Authentication Flow
```
User → Login/Register → Supabase Auth → Session Created → UserContext Updated → Protected Routes Accessible
```

### Quiz Generation Flow
```
User uploads file → FileUploadCard extracts text → Calls Edge Function → OpenAI generates quiz → Saved to Supabase → Quiz displayed
```

### Quiz Taking Flow
```
User starts quiz → Quiz.jsx fetches questions → Injects retention questions → User answers → Checks retention → Saves results → Shows results
```

### Retention Algorithm Flow
```
Quiz submission → Check score → If < 70%, mark as failed → Future quizzes fetch failed questions → Inject into new quiz → Force retake if failed
```

## Key Design Decisions

### 1. **Serverless Architecture**
- **Why:** Scalability, cost-efficiency, no server management
- **Implementation:** Supabase Edge Functions + Database

### 2. **Client-Side Text Extraction**
- **Why:** Reduce server load, faster processing
- **Libraries:** pdfjs-dist, tesseract.js, mammoth

### 3. **Row Level Security (RLS)**
- **Why:** Data isolation, security at database level
- **Implementation:** Policies in schema.sql

### 4. **Context API for State**
- **Why:** Simpler than Redux for this scale
- **Implementation:** UserContext for auth, ThemeContext for UI

### 5. **Component-Based UI**
- **Why:** Reusability, maintainability
- **Implementation:** Shadcn UI + custom components

## Code Organization Principles

### 1. **Separation of Concerns**
- Components handle UI only
- Context handles state
- Supabase client handles data
- Edge Functions handle business logic

### 2. **Single Responsibility**
- Each component has one clear purpose
- Each function does one thing well

### 3. **DRY (Don't Repeat Yourself)**
- Reusable components in `/components/ui`
- Shared utilities in `/lib`
- Common styles via Tailwind

### 4. **Consistent Naming**
- Components: PascalCase (e.g., `FileUploadCard.jsx`)
- Functions: camelCase (e.g., `handleSubmit`)
- Files: Match component name

## State Management

### Global State (Context)
- **UserContext:** Authentication, user data, session
- **ThemeContext:** Dark/light mode preference

### Local State (useState)
- Component-specific UI state
- Form inputs
- Loading states

### Server State (TanStack Query)
- Quiz history
- Leaderboard data
- Cached API responses

## Styling Approach

### Tailwind CSS
- Utility-first approach
- Custom color palette: `#1E2D4C`, `#ACBDAA`, `#CECOBB`, `#858585`
- Responsive design with breakpoints
- Dark mode support

### Component Styling
- Inline Tailwind classes
- Shadcn UI base styles
- Custom animations with Framer Motion

## Performance Optimizations

1. **Code Splitting:** React.lazy for route-based splitting
2. **Memoization:** React.memo for expensive components
3. **Query Caching:** TanStack Query for server state
4. **Debouncing:** Input handlers for search/filter
5. **Lazy Loading:** Images and heavy components

## Security Measures

1. **Row Level Security:** Database-level access control
2. **JWT Tokens:** Secure session management
3. **Environment Variables:** Sensitive keys in .env
4. **Input Validation:** Client and server-side validation
5. **HTTPS Only:** Secure communication

## Testing Strategy

### Recommended Approach
1. **Unit Tests:** Component logic, utility functions
2. **Integration Tests:** User flows, API interactions
3. **E2E Tests:** Critical user journeys
4. **Manual Testing:** UI/UX validation

### Tools (Not yet implemented)
- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy: Connect Git repository
3. Environment variables: Set in platform dashboard

### Backend (Supabase)
1. Database: Already deployed
2. Edge Functions: `supabase functions deploy`
3. Secrets: `supabase secrets set`

## Future Improvements

1. **TypeScript Migration:** Add type safety
2. **Test Coverage:** Implement comprehensive testing
3. **Analytics:** Track user behavior and quiz performance
4. **Accessibility:** WCAG 2.1 AA compliance
5. **Internationalization:** Multi-language support
6. **Progressive Web App:** Offline functionality
7. **Real-time Features:** Live leaderboard updates
8. **Advanced Analytics:** Learning insights dashboard
