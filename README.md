# 🎵 MoodScope AI - Next.js Frontend

A modern, animated Next.js application for analyzing Spotify playlists and discovering music moods through AI-powered insights. Built with cutting-edge web technologies and beautiful UI animations.

## ✨ Features

- **🎨 Beautiful Animated UI** with Framer Motion transitions
- **📊 Interactive Data Visualizations** using Recharts
- **📱 Responsive Design** optimized for all devices
- **🔒 TypeScript Support** for robust type safety
- **🌟 Modern Glass-morphism Effects** and gradients
- **🎧 Real-time Spotify Analysis** with audio features
- **🤖 AI-Powered Insights** and mood coaching
- **⚡ Fast Performance** with Next.js 15 optimizations

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: FastAPI (deployed separately)

## 🚀 Live Demo

- **Frontend**: [https://moodscope-ai.vercel.app](https://moodscope-ai.vercel.app)
- **Backend API**: [https://moodscale-production.up.railway.app](https://moodscale-production.up.railway.app)

## 🏁 Quick Start

### Prerequisites

- Node.js 18+ installed
- A modern web browser

### Installation

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd NextMoodscale
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://moodscale-production.up.railway.app
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## 📋 How to Use

1. **Enter a public Spotify playlist URL**
2. **Click "Analyze Playlist"** 
3. **Explore beautiful visualizations** of your music mood
4. **Discover AI insights** about your music taste

### Example Playlist URLs
```
https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd
```

## 🎨 Key Features

### 🎭 Animated User Interface
- Smooth page transitions and micro-interactions
- Responsive hover effects and loading states
- Glass-morphism design with gradient backgrounds
- Mobile-optimized touch interactions

### 📊 Data Visualizations
- **Mood Distribution Charts** - Emotional breakdown of your playlist
- **Audio Features Radar** - Visualize energy, valence, danceability
- **Track Scatter Plots** - Map songs on emotional dimensions
- **Animated Chart Transitions** - Smooth data presentation

### 🤖 AI-Powered Insights
- Personalized emotional analysis
- Music taste personality profiling
- Custom recommendations based on preferences
- Mood-based coaching and wellness tips

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and animations
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Main application page
├── components/                   # React components
│   ├── charts/                  # Visualization components
│   │   ├── MoodChart.tsx
│   │   ├── AudioFeaturesChart.tsx
│   │   └── ValenceEnergyChart.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── visualizations/          # Advanced chart components
│   ├── ai/                      # AI insights components
│   ├── Header.tsx               # Application header
│   ├── PlaylistInput.tsx        # URL input form
│   └── AnalysisResults.tsx      # Results display
├── lib/                         # Utilities and configuration
│   ├── api.ts                   # API client and types
│   ├── types.ts                 # TypeScript definitions
│   └── utils.ts                 # Helper functions
└── styles/                      # Additional stylesheets
```

## 🔧 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run lint:fix
```

## 🌐 API Integration

The frontend communicates with a FastAPI backend for playlist analysis:

### Main Endpoints
- `POST /analyze` - Analyze Spotify playlist
- `GET /health` - API health check
- `GET /demo` - Demo data for testing

### Example API Usage
```typescript
import { moodScopeAPI } from '@/lib/api';

const analysis = await moodScopeAPI.analyzePlaylist(
  'https://open.spotify.com/playlist/...'
);
```

## 🚀 Deployment

### Environment Setup

Production environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Deploy to Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on git push

### Local Production Build

```bash
npm run build
npm start
```

## 🎯 Design Philosophy

### User Experience
- **Intuitive Navigation** - Clear, simple user flows
- **Visual Hierarchy** - Important information stands out
- **Responsive Design** - Works perfectly on all devices
- **Accessibility** - WCAG compliant components

### Performance
- **Optimized Loading** - Code splitting and lazy loading
- **Smooth Animations** - 60fps transitions with Framer Motion
- **Efficient Rendering** - React best practices
- **Fast API Calls** - Optimized backend communication

## 🏆 Perfect for Portfolios

This project demonstrates:

✅ **Modern Web Development** - Next.js 15, TypeScript, Tailwind  
✅ **Advanced Animations** - Framer Motion expertise  
✅ **Data Visualization** - Complex chart implementations  
✅ **API Integration** - Full-stack communication  
✅ **Responsive Design** - Mobile-first approach  
✅ **Code Quality** - Clean architecture and best practices  
✅ **User Experience** - Polished, professional interface  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Experience music like never before with MoodScope AI** 🎵✨

Built with ❤️ using Next.js and modern web technologies.
