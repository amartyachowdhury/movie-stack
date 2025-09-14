# Movie Stack - Minimal Version

A clean, minimal movie application focusing on core features only.

## 🎯 Features

- **Movie Listing**: Browse movies in a grid layout
- **Movie Details**: View detailed information about individual movies
- **Search**: Search for movies by title or description
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

- **Frontend**: React + Vite (fast, modern, no caching issues)
- **Backend**: Express.js (simple, lightweight)
- **Database**: SQLite (no external dependencies)
- **Docker**: Multi-stage builds for optimal size

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Running the Application

1. **Clone and navigate to the project:**
   ```bash
   cd movie-stack-minimal
   ```

2. **Set up TMDB API (Optional but Recommended):**
   - Go to [https://developer.themoviedb.org/](https://developer.themoviedb.org/)
   - Sign up for a free account
   - Create a new API key
   - Copy your API key
   - Create a `.env` file in the root directory:
     ```bash
     cp env.example .env
     # Edit .env and add your TMDB_API_KEY
     ```

3. **Start the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5002/api

### Development Mode

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
movie-stack-minimal/
├── backend/
│   ├── server.js          # Express.js server
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React app
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── docker-compose.yml     # Docker services
├── Dockerfile.backend     # Backend Docker image
├── Dockerfile.frontend    # Frontend Docker image
├── nginx.conf            # Nginx configuration
└── README.md             # This file
```

## 🔌 API Endpoints

### Local Database
- `GET /api/movies` - Get all movies (with pagination)
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/search?q=query` - Search movies

### TMDB API Integration
- `GET /api/movies/popular` - Get popular movies from TMDB
- `GET /api/movies/top-rated` - Get top rated movies from TMDB
- `GET /api/movies/search/tmdb?q=query` - Search movies using TMDB
- `GET /api/movies/:id/tmdb` - Get movie details from TMDB
- `GET /api/genres` - Get movie genres from TMDB

### System
- `GET /api/health` - Health check

## 🎨 Design

- **Dark Theme**: Netflix-inspired dark interface
- **Responsive Grid**: Adaptive movie card layout
- **Clean Typography**: Modern, readable fonts
- **Smooth Animations**: Hover effects and transitions

## 🐳 Docker Benefits

- **Consistent Environment**: Same setup across all machines
- **Easy Deployment**: Single command to start everything
- **Isolated Dependencies**: No conflicts with system packages
- **Production Ready**: Optimized builds and health checks

## 🔧 Why This Version?

This minimal version eliminates the complex issues we encountered:

- ❌ **No Service Workers**: No caching problems
- ❌ **No Create React App**: Uses Vite for faster builds
- ❌ **No Flask Complexity**: Simple Express.js backend
- ❌ **No MySQL**: SQLite for simplicity
- ❌ **No Authentication**: Focus on core movie features
- ❌ **No Analytics**: Clean, distraction-free code

## 📊 Movie Data

### With TMDB API Key:
- **Thousands of real movies** with posters, ratings, and details
- **Real-time search** across TMDB's database
- **Popular and top-rated** movie collections
- **Movie genres** and detailed information

### Without API Key (Fallback):
The application comes with 3 sample movies:
- Fight Club
- Forrest Gump  
- The Godfather

## 🛠️ Customization

To add more movies, modify the `sampleMovies` array in `backend/server.js`.

To change the theme, modify the CSS variables in `frontend/src/index.css`.

## 📝 License

MIT License - feel free to use this as a starting point for your own projects!
