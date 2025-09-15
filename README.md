# Movie Stack - TMDB Powered

A modern, feature-rich movie application powered by The Movie Database (TMDB) API, providing real-time access to comprehensive movie data.

## 🎯 Features

### 🎬 **Rich Movie Experience**
- **Enhanced Movie Cards**: Beautiful cards with backdrop images, ratings, genres, and popularity badges
- **Detailed Movie Pages**: Comprehensive movie information including cast, crew, financial data, and production details
- **Real-time Data**: Always up-to-date movie information from TMDB's extensive database
- **Search & Discovery**: Search across TMDB's entire movie database
- **Popular & Top-rated**: Browse trending and critically acclaimed movies

### 📱 **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Fast Loading**: Vite-powered frontend with optimized builds
- **Modern UI**: Clean, professional interface with rich visual elements
- **Error Handling**: Graceful fallbacks and user-friendly error messages

## 🏗️ Architecture

### **Frontend**
- **React 18** with modern hooks and functional components
- **Vite** for fast development and optimized production builds
- **React Router DOM** for seamless navigation
- **Responsive CSS** with modern grid and flexbox layouts

### **Backend**
- **Express.js** RESTful API server
- **TMDB API Integration** for real-time movie data
- **CORS enabled** for cross-origin requests
- **Error handling** with structured JSON responses

### **Data Source**
- **The Movie Database (TMDB)** - Comprehensive movie database
- **Real-time API calls** - No local database, always fresh data
- **Rich metadata** - Cast, crew, financial data, similar movies, and more

### **Deployment**
- **Docker** multi-container setup
- **Nginx** for frontend serving
- **Environment-based configuration**

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- TMDB API key (free at [themoviedb.org](https://developer.themoviedb.org/))

### Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-stack
   ```

2. **Configure TMDB API**
   ```bash
   cp env.example .env
   # Edit .env and add your TMDB_API_KEY
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5002/api

## 📊 API Endpoints

### **Movies**
- `GET /api/movies` - Popular movies (default)
- `GET /api/movies/popular` - Popular movies from TMDB
- `GET /api/movies/top-rated` - Top rated movies from TMDB
- `GET /api/movies/search?q={query}` - Search movies
- `GET /api/movies/{id}` - Detailed movie information

### **Additional**
- `GET /api/genres` - Available movie genres
- `GET /api/health` - API health check

## 🎨 Features Showcase

### **Enhanced Movie Cards**
- Backdrop images with poster overlays
- Star ratings with vote counts
- Genre chips with overflow handling
- Popularity badges (Trending, Popular, Rising)
- Adult content indicators
- Language flags
- Runtime and financial information

### **Detailed Movie Pages**
- Hero sections with backdrop images
- Complete cast and crew information
- Financial data (budget, revenue, profit/loss)
- Production company and country details
- Similar movies recommendations
- External links (homepage, IMDB)

## 🔧 Development

### **Frontend Development**
```bash
cd frontend
npm install
npm run dev
```

### **Backend Development**
```bash
cd backend
npm install
npm run dev
```

### **Environment Variables**
```env
# TMDB API Configuration
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## 📁 Project Structure

```
movie-stack/
├── backend/
│   ├── services/
│   │   └── tmdbService.js    # TMDB API integration
│   ├── server.js             # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application
│   │   ├── index.css         # Styles
│   │   └── main.jsx          # Entry point
│   └── package.json
├── docker-compose.yml        # Multi-container setup
├── Dockerfile.backend        # Backend container
├── Dockerfile.frontend       # Frontend container
└── nginx.conf               # Nginx configuration
```

## 🌟 Key Benefits

- **Real-time Data**: Always current movie information
- **Rich Content**: Comprehensive movie details and metadata
- **Scalable**: No local database maintenance required
- **Professional**: Production-ready architecture
- **Modern**: Latest React and Node.js best practices

## 📝 License

MIT License - feel free to use this as a starting point for your own projects!
