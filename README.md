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

2. **Configure environment**
   ```bash
   cp env.template .env
   # Edit .env and add your TMDB_API_KEY
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3002
   - API: http://localhost:5002/api

## 📝 License

MIT License - feel free to use this as a starting point for your own projects!
